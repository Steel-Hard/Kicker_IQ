from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.repositories.sessao_repository import SessaoRepository
from app.repositories.atleta_repository import AtletaRepository
from app.schemas.responses import DashboardStats, RadarData, HistoricoSerie, SimilarityResponse
from app.schemas.requests import CompareRequest
from app.services.data_processing import FEATURES
from app.services.analytics import construir_perfis, sugerir_substitutos, calcular_zscore_por_atleta, FEATURES_COMPOSTAS
import pandas as pd

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: str = Depends(get_current_user)):
    sessao_repo = SessaoRepository()
    atleta_repo = AtletaRepository()
    
    atletas = await atleta_repo.get_all()
    sessoes = await sessao_repo.get_all()
    
    total_atletas = len(atletas)
    total_sessoes = len(sessoes)
    
    df = pd.DataFrame([s.model_dump() for s in sessoes])
    
    if df.empty:
        return DashboardStats(
            total_atletas=total_atletas,
            total_sessoes=total_sessoes,
            altas_desempenho=0,
            quedas_desempenho=0,
            desempenho_medio=0,
            total_anomalias=0
        )
        
    altas = int((df['classificacao'] == 'Alta de Desempenho').sum()) if 'classificacao' in df.columns else 0
    quedas = int((df['classificacao'] == 'Queda de Desempenho').sum()) if 'classificacao' in df.columns else 0
    medias = int((df['classificacao'] == 'Desempenho Médio').sum()) if 'classificacao' in df.columns else 0
    anomalias = int(df['if_anomalia'].fillna(False).sum()) if 'if_anomalia' in df.columns else 0
    
    return DashboardStats(
        total_atletas=total_atletas,
        total_sessoes=total_sessoes,
        altas_desempenho=altas,
        quedas_desempenho=quedas,
        desempenho_medio=medias,
        total_anomalias=anomalias
    )

@router.post("/radar", response_model=RadarData)
async def get_radar_data(req: CompareRequest, current_user: str = Depends(get_current_user)):
    sessao_repo = SessaoRepository()
    sessoes = await sessao_repo.get_all()
    
    if not sessoes:
        raise HTTPException(status_code=404, detail="Sem dados.")
    
    # Mapping: original feature name -> MongoDB snake_case column name
    FEATURE_TO_COL = {
        "Workload": "workload",
        "Distance (m)": "distance_m",
        "Metres per Minute (m)": "metres_per_minute",
        "High Intensity Running (m)": "high_intensity_running_m",
        "Sprint Distance (m)": "sprint_distance_m",
        "Top Speed (kph)": "top_speed_kph",
        "Avg Speed (kph)": "avg_speed_kph",
        "Accelerations": "accelerations",
        "Decelerations": "decelerations",
        "No. of Sprints": "no_of_sprints",
        "Duration (mins)": "duration_mins",
    }
    
    # Build DataFrame from MongoDB documents
    records = []
    for s in sessoes:
        rec = s.model_dump()
        rec['Athlete ID'] = rec['athlete_id']
        records.append(rec)
    
    df = pd.DataFrame(records)
    
    features_radar = [f for f in req.features if f in FEATURES]
    labels_radar = [f.replace(' (m)', '').replace(' (kph)', '').replace('No. of ', '') for f in features_radar]
    
    # Map feature names to actual DB column names
    db_cols = [FEATURE_TO_COL.get(f, f) for f in features_radar]
    available_cols = [c for c in db_cols if c in df.columns]
    
    if not available_cols:
        raise HTTPException(status_code=404, detail="Nenhuma feature disponível.")
    
    # Compute each athlete's AVERAGE for each raw metric
    athlete_avgs = df.groupby('Athlete ID')[available_cols].mean()
    
    # Compute Z-scores BETWEEN athletes (global mean/std across all athletes)
    global_mean = athlete_avgs.mean()
    global_std = athlete_avgs.std(ddof=1)
    global_std = global_std.replace(0, 1)  # avoid division by zero
    
    athlete_zscores = (athlete_avgs - global_mean) / global_std
    
    datasets = []
    for atleta in req.athlete_ids:
        if atleta in athlete_zscores.index:
            valores = []
            for f in features_radar:
                col = FEATURE_TO_COL.get(f, f)
                if col in athlete_zscores.columns:
                    valores.append(round(float(athlete_zscores.loc[atleta, col]), 3))
                else:
                    valores.append(0.0)
            datasets.append({
                "label": f"Atleta {atleta}",
                "data": valores
            })
            
    return RadarData(labels=labels_radar, datasets=datasets)

@router.get("/historico/{athlete_id}", response_model=HistoricoSerie)
async def get_historico(athlete_id: str, current_user: str = Depends(get_current_user)):
    sessao_repo = SessaoRepository()
    sessoes = await sessao_repo.get_by_athlete(athlete_id)
    
    if not sessoes:
        raise HTTPException(status_code=404, detail="Atleta não encontrado ou sem sessões.")
        
    datas = [s.start_date.isoformat() for s in sessoes]
    valores = [float(s.if_score) if s.if_score is not None else 0.0 for s in sessoes]
    anomalias = [bool(s.if_anomalia) for s in sessoes]
    
    return HistoricoSerie(datas=datas, valores=valores, anomalias=anomalias)

@router.get("/similarity/{athlete_id}", response_model=list[SimilarityResponse])
async def get_similarity(athlete_id: str, topN: int = 3, current_user: str = Depends(get_current_user)):
    sessao_repo = SessaoRepository()
    sessoes = await sessao_repo.get_all()
    
    if not sessoes:
        raise HTTPException(status_code=404, detail="Sem dados de sessões.")
    
    # Map MongoDB fields to the expected feature names
    FEATURE_TO_COL = {
        'Distance (m)': 'distance_m',
        'Workload': 'workload',
        'High Intensity Running (m)': 'high_intensity_running_m',
        'Sprint Distance (m)': 'sprint_distance_m',
        'Accelerations': 'accelerations',
        'Decelerations': 'decelerations',
    }
    
    records = []
    for s in sessoes:
        rec = s.model_dump()
        rec['Athlete ID'] = rec['athlete_id']
        records.append(rec)
    
    df = pd.DataFrame(records)
    
    # Use available columns
    available_features = [f for f in FEATURES_COMPOSTAS if FEATURE_TO_COL.get(f, f) in df.columns]
    db_cols = [FEATURE_TO_COL.get(f, f) for f in available_features]
    
    if not db_cols:
        return []
    
    # Build profiles: average z-scores per athlete
    perfis = df.groupby('Athlete ID')[db_cols].mean()
    
    resultados = sugerir_substitutos(athlete_id, perfis, top_n=topN)
    return resultados
