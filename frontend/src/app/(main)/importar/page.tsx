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
    <div className="flex items-center gap-0 w-full max-w-md mx-auto">
      {steps.map((s, i) => (
        <div key={s.n} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : 'flex-none'}`}>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors duration-200"
              style={{
                background: current > s.n
                  ? 'var(--chart-baseline)'
                  : current === s.n
                  ? 'var(--primary)'
                  : 'var(--surface-4)',
                color: current >= s.n ? '#000' : 'var(--text-subtle)'
              }}
            >
              {current > s.n ? <Check size={11} /> : s.n}
            </div>
            <span
              className="text-[9px] font-medium tracking-[0.3px]"
              style={{
                color: current >= s.n ? 'var(--text-secondary)' : 'var(--text-subtle)'
              }}
            >
              {s.label.toUpperCase()}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-px mx-1.5 mb-4 transition-colors duration-200"
              style={{
                background: current > s.n ? 'var(--chart-baseline)' : 'var(--border-emphasis)'
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
    <div className="flex flex-col min-h-screen bg-surface-1">
      <TopBar title="Importar partida" />

      <div className="flex flex-col gap-6 p-5 pb-8 md:p-10 w-full max-w-2xl mx-auto">
        {/* Stepper */}
        <div className="animate-slide-down">
          <Stepper current={step} />
        </div>

        {/* Step 1: Match info */}
        {step === 1 && (
          <div className="animate-slide-up flex flex-col gap-4 bg-surface-2 p-5 rounded-xl border border-border-default md:p-8 shadow-sm">
            <div className="k-section-label">INFORMAÇÕES DA PARTIDA</div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-text-subtle font-medium">DATA</label>
                <input
                  className="k-field"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-text-subtle font-medium">COMPETIÇÃO</label>
                <select
                  className="k-field"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    colorScheme: 'dark',
                  }}
                >
                  <option value="" disabled>Selecionar…</option>
                  <option>Campeonato Brasileiro — Série A</option>
                  <option>Copa do Brasil</option>
                  <option>Campeonato Paulista</option>
                  <option>Copa Libertadores</option>
                  <option>Treino / Amistoso</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-text-subtle font-medium">MANDANTE</label>
                  <input
                    className="k-field"
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    placeholder="Equipe da casa"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-text-subtle font-medium">VISITANTE</label>
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
              className="k-btn-primary w-full mt-4 md:w-auto md:self-end md:px-8"
              disabled={!competition || !matchDate || !awayTeam}
              onClick={() => setStep(2)}
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
          <div className="animate-slide-up flex flex-col gap-4 bg-surface-2 p-5 rounded-xl border border-border-default md:p-8 shadow-sm">
            <div className="k-section-label">ARQUIVO DE DADOS GPS</div>

            {/* Drop zone */}
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
              className="rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-150 border-[1.5px] border-dashed"
              style={{
                borderColor: dragging ? 'var(--primary)' : file ? 'var(--chart-baseline)' : 'var(--border-muted)',
                background: dragging
                  ? 'rgba(218,165,32,0.05)'
                  : file
                  ? 'rgba(29,158,117,0.05)'
                  : 'var(--surface-3)',
              }}
            >
              {file ? (
                <>
                  <div className="w-11 h-11 rounded-full bg-success-bg flex items-center justify-center">
                    <FileText size={20} color="var(--success-text)" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-text-primary">{file}</div>
                    <div className="text-[10px] text-text-subtle mt-1">
                      Arquivo carregado com sucesso
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full border border-dashed border-border-muted flex items-center justify-center">
                    <CloudUpload size={20} color="var(--text-subtle)" />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-text-secondary">
                      Arraste o arquivo ou clique para selecionar
                    </div>
                    <div className="text-[10px] text-text-subtle mt-1">
                      .csv · .xlsx · .gpx — máx. 50 MB
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="k-section-label mt-1">FORMATO ACEITO</div>
            <div className="bg-surface-3 border border-border-default rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {['Catapult Sports (.csv)', 'Statsports Viper (.xlsx)', 'GPX padrão (.gpx)', 'Polar Team Pro (.csv)'].map((fmt) => (
                <div key={fmt} className="flex items-center gap-2 py-1">
                  <span className="k-dot k-dot--muted" />
                  <span className="text-[11px] text-text-secondary">{fmt}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4 md:justify-end">
              <button className="k-btn-outline flex-1 md:flex-none md:w-32" onClick={() => setStep(1)}>
                Voltar
              </button>
              <button
                className="k-btn-primary flex-1 md:flex-none md:w-32"
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
          <div className="animate-slide-up flex flex-col gap-4 bg-surface-2 p-5 rounded-xl border border-border-default md:p-8 shadow-sm">
            <div className="k-section-label">RESUMO DA IMPORTAÇÃO</div>

            <div className="bg-surface-3 border border-border-default rounded-lg overflow-hidden">
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
                  className={`flex justify-between items-center px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border-subtle' : ''}`}
                >
                  <span className="text-[11px] text-text-subtle font-medium">{label}</span>
                  <span className="text-xs text-text-primary max-w-[55%] text-right">{val}</span>
                </div>
              ))}
            </div>

            <div className="bg-[rgba(29,158,117,0.07)] border border-[rgba(29,158,117,0.25)] rounded-lg p-3">
              <div className="flex items-center gap-1.5">
                <Check size={13} color="var(--chart-baseline)" />
                <span className="text-[11px] font-medium text-success">
                  Validação concluída sem erros
                </span>
              </div>
              <p className="text-[10px] text-text-subtle mt-1.5 leading-[1.5]">
                Todos os campos obrigatórios foram preenchidos. O arquivo GPS será processado e
                os dados serão vinculados automaticamente aos atletas do elenco.
              </p>
            </div>

            <div className="flex gap-2 mt-2 md:justify-end">
              <button className="k-btn-outline flex-1 md:flex-none md:w-32" onClick={() => setStep(2)}>
                Voltar
              </button>
              <button
                className="k-btn-primary flex-1 md:flex-none md:w-32"
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

