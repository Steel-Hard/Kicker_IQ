import pandas as pd
from app.services.analytics import classificar_sessao

def test_classificar_sessao():
    # Anomalia e Z-score alto
    row1 = {"if_anomalia": True, "Z_Composto": 1.6}
    assert classificar_sessao(row1) == "Alta de Desempenho"
    
    # Anomalia e Z-score baixo
    row2 = {"if_anomalia": True, "Z_Composto": -1.6}
    assert classificar_sessao(row2) == "Queda de Desempenho"
    
    # Anomalia mas Z-score dentro do limiar
    row3 = {"if_anomalia": True, "Z_Composto": 1.0}
    assert classificar_sessao(row3) == "Desempenho Médio"
    
    # Não anomalia
    row4 = {"if_anomalia": False, "Z_Composto": 2.0}
    assert classificar_sessao(row4) == "Desempenho Médio"
    
    # Faltando dados
    row5 = {"if_anomalia": None, "Z_Composto": None}
    assert classificar_sessao(row5) == "Desempenho Médio"
