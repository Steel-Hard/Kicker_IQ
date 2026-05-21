'use client'

import { useState } from 'react'
import { CloudUpload, FileText, Check } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'

type Step = 1 | 2 | 3

function Stepper({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: 'Partida' },
    { n: 2, label: 'Dados' },
    { n: 3, label: 'Confirmar' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 500,
                background: current > s.n
                  ? 'var(--chart-baseline)'
                  : current === s.n
                  ? 'var(--primary)'
                  : 'var(--surface-4)',
                color: current >= s.n ? '#000' : 'var(--text-subtle)',
                transition: 'background 200ms',
              }}
            >
              {current > s.n ? <Check size={11} /> : s.n}
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 500,
                color: current >= s.n ? 'var(--text-secondary)' : 'var(--text-subtle)',
                letterSpacing: 0.3,
              }}
            >
              {s.label.toUpperCase()}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 1,
                background: current > s.n ? 'var(--chart-baseline)' : 'var(--border-emphasis)',
                margin: '0 6px',
                marginBottom: 16,
                transition: 'background 200ms',
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ImportarPage() {
  const [step, setStep] = useState<Step>(1)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<string | null>(null)
  const [competition, setCompetition] = useState('')
  const [homeTeam, setHomeTeam] = useState('São Paulo FC')
  const [awayTeam, setAwayTeam] = useState('')
  const [matchDate, setMatchDate] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-1)' }}>
      <TopBar title="Importar partida" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 14px', paddingBottom: 32 }}>

        {/* Stepper */}
        <Stepper current={step} />

        {/* Step 1: Match info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="k-section-label">INFORMAÇÕES DA PARTIDA</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>DATA</label>
                <input
                  className="k-field"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>COMPETIÇÃO</label>
                <select
                  className="k-field"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  style={{ appearance: 'none', cursor: 'pointer', colorScheme: 'dark' }}
                >
                  <option value="" disabled>Selecionar…</option>
                  <option>Campeonato Brasileiro — Série A</option>
                  <option>Copa do Brasil</option>
                  <option>Campeonato Paulista</option>
                  <option>Copa Libertadores</option>
                  <option>Treino / Amistoso</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>MANDANTE</label>
                  <input
                    className="k-field"
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    placeholder="Equipe da casa"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>VISITANTE</label>
                  <input
                    className="k-field"
                    value={awayTeam}
                    onChange={(e) => setAwayTeam(e.target.value)}
                    placeholder="Equipe adversária"
                  />
                </div>
              </div>
            </div>

            <button
              className="k-btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={!competition || !matchDate || !awayTeam}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="k-section-label">ARQUIVO DE DADOS GPS</div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                const f = e.dataTransfer.files[0]
                if (f) setFile(f.name)
              }}
              onClick={() => setFile('dados_j23_gps_export.csv')}
              style={{
                border: `1.5px dashed ${dragging ? 'var(--primary)' : file ? 'var(--chart-baseline)' : 'var(--border-muted)'}`,
                borderRadius: 12,
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                background: dragging
                  ? 'rgba(218,165,32,0.05)'
                  : file
                  ? 'rgba(29,158,117,0.05)'
                  : 'var(--surface-2)',
                transition: 'all 150ms',
              }}
            >
              {file ? (
                <>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'var(--success-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={20} color="var(--success-text)" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{file}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 3 }}>
                      Arquivo carregado com sucesso
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: '1px dashed var(--border-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CloudUpload size={20} color="var(--text-subtle)" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Arraste o arquivo ou clique para selecionar
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 3 }}>
                      .csv · .xlsx · .gpx — máx. 50 MB
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="k-section-label" style={{ marginTop: 4 }}>FORMATO ACEITO</div>
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                padding: '12px 14px',
              }}
            >
              {['Catapult Sports (.csv)', 'Statsports Viper (.xlsx)', 'GPX padrão (.gpx)', 'Polar Team Pro (.csv)'].map((fmt) => (
                <div
                  key={fmt}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}
                >
                  <span className="k-dot k-dot--muted" />
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{fmt}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="k-btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>
                Voltar
              </button>
              <button
                className="k-btn-primary"
                style={{ flex: 1 }}
                disabled={!file}
                onClick={() => setStep(3)}
              >
                Processar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="k-section-label">RESUMO DA IMPORTAÇÃO</div>

            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Partida', val: `${homeTeam} vs ${awayTeam || 'Adversário'}` },
                { label: 'Competição', val: competition || 'Não informada' },
                { label: 'Data', val: matchDate || 'Não informada' },
                { label: 'Arquivo', val: file || 'Sem arquivo' },
                { label: 'Atletas detectados', val: '18 jogadores' },
                { label: 'Registros GPS', val: '126.480 amostras' },
              ].map(({ label, val }, i, arr) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '11px 14px',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)', maxWidth: '55%', textAlign: 'right' }}>{val}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: 'rgba(29,158,117,0.07)',
                border: '1px solid rgba(29,158,117,0.25)',
                borderRadius: 10,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={13} color="var(--chart-baseline)" />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--success)' }}>
                  Validação concluída sem erros
                </span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 4, lineHeight: 1.5 }}>
                Todos os campos obrigatórios foram preenchidos. O arquivo GPS será processado e
                os dados serão vinculados automaticamente aos atletas do elenco.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="k-btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>
                Voltar
              </button>
              <button
                className="k-btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  setStep(1)
                  setFile(null)
                  setCompetition('')
                  setAwayTeam('')
                  setMatchDate('')
                }}
              >
                Confirmar ↗
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
