import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_distances, euclidean_distances

FEATURES_COMPOSTAS = [
    'Distance (m)', 'Workload', 'High Intensity Running (m)',
    'Sprint Distance (m)', 'Accelerations', 'Decelerations'
]

def calcular_zscore_por_atleta(df: pd.DataFrame, features: list) -> pd.DataFrame:
    resultados = []
    for athlete_id, grupo in df.groupby('Athlete ID'):
        grupo_c = grupo.copy()
        for feat in features:
            serie = grupo_c[feat]
            mu_atleta = serie.mean()
            sigma_atleta = serie.std(ddof=1)
            
            if sigma_atleta == 0 or pd.isna(sigma_atleta):
                grupo_c[f'Z_{feat}'] = 0.0
            else:
                grupo_c[f'Z_{feat}'] = (serie - mu_atleta) / sigma_atleta
                
        resultados.append(grupo_c)
        
    if not resultados:
        return df.copy()
        
    return pd.concat(resultados, ignore_index=True)

def calcular_z_composto(df: pd.DataFrame, features: list) -> pd.DataFrame:
    fc = [f for f in FEATURES_COMPOSTAS if f in features]
    z_compostas = [f'Z_{f}' for f in fc]
    df['Z_Composto'] = df[z_compostas].mean(axis=1)
    return df

def classificar_sessao(row, z_threshold=1.5):
    z_composto = row.get('Z_Composto')
    if_anomalia = row.get('if_anomalia')

    # Se Z_Composto não existe ou é NaN, não há dados suficientes
    if z_composto is None or pd.isna(z_composto):
        return 'Desempenho Médio'

    # Classificação baseada no Z-Score composto (métrica principal de desempenho)
    # if_anomalia serve como reforço de confiança, mas não bloqueia a classificação
    if z_composto > z_threshold:
        return 'Alta de Desempenho'
    elif z_composto < -z_threshold:
        return 'Queda de Desempenho'
    else:
        return 'Desempenho Médio'

def classificar_df(df: pd.DataFrame) -> pd.DataFrame:
    df['Classificacao'] = df.apply(classificar_sessao, axis=1)
    return df

def construir_perfis(df_zscores: pd.DataFrame, z_cols: list) -> pd.DataFrame:
    return df_zscores.groupby('Athlete ID')[z_cols].mean()

def sugerir_substitutos(atleta_referencia: str, perfis: pd.DataFrame, top_n: int = 3):
    if atleta_referencia not in perfis.index:
        return []
        
    X_perfis = perfis.values
    ids_atletas = perfis.index.tolist()
    
    dist_eucl = euclidean_distances(X_perfis)
    df_eucl = pd.DataFrame(dist_eucl, index=ids_atletas, columns=ids_atletas)
    
    dist_cos = cosine_distances(X_perfis)
    df_cos = pd.DataFrame(dist_cos, index=ids_atletas, columns=ids_atletas)
    
    outros = [a for a in ids_atletas if a != atleta_referencia]
    resultados = []
    
    for outro in outros:
        d_eucl = df_eucl.loc[atleta_referencia, outro]
        d_cos = df_cos.loc[atleta_referencia, outro]
        
        sim_eucl = 1 / (1 + d_eucl)
        sim_cos = max(0, 1 - d_cos)
        score = (sim_eucl * 0.4 + sim_cos * 0.6)
        
        resultados.append({
            "atleta_candidato": str(outro),
            "distancia_euclidiana": float(d_eucl),
            "distancia_cosseno": float(d_cos),
            "similaridade": float(score)
        })
        
    resultados = sorted(resultados, key=lambda x: x["similaridade"], reverse=True)
    return resultados[:top_n]
