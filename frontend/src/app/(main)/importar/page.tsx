'use client'

import { useState, useEffect } from 'react'
import { CloudUpload, FileText, Check, Search, Calendar, Loader2, Download } from 'lucide-react'
import { TopBar } from '@/components/kicker/top-bar'
import { apiService } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

type Step = 1 | 2 | 3

function Stepper({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: 'Data' },
    { n: 2, label: 'Upload' },
    { n: 3, label: 'Confirmar' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
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
  const { token, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState<Step>(1)
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<Record<string, unknown>[]>([])
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0])
  
  const [lookupId, setLookupId] = useState('')
  const [lookupDate, setLookupDate] = useState('')
  const [lookupResult, setLookupResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login')
    }
  }, [authLoading, router, token])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | null = null
    if ('files' in e.target && e.target.files) {
      file = e.target.files[0]
    } else if ('dataTransfer' in e) {
      file = e.dataTransfer.files[0]
    }

    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          if (file?.name.endsWith('.json')) {
            setParsedData(JSON.parse(content))
          } else {
            const lines = content.split('\n')
            const headers = lines[0].split(',')
            const data = lines.slice(1).map(line => {
              const values = line.split(',')
              return headers.reduce((obj, header, i) => {
                obj[header.trim()] = values[i]?.trim()
                return obj
              }, {} as Record<string, unknown>)
            })
            setParsedData(data.filter(d => d["Athlete ID"]))
          }
        } catch {
          setError('Falha ao processar arquivo.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleConfirmImport = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const recordsWithMeta = parsedData.map(d => ({
        ...d,
        "Start Date": d["Start Date"] || matchDate
      }))
      
      await apiService.athletes.import(recordsWithMeta, token)
      setStep(1)
      setFileName(null)
      setParsedData([])
      alert('Dados importados com sucesso!')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao importar dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleLookup = async (type: 'id' | 'date') => {
    if (!token) return
    setLoading(true)
    setLookupResult(null)
    setError(null)
    try {
      let data
      if (type === 'id') {
        data = await apiService.athletes.getById(lookupId, token)
      } else {
        data = await apiService.athletes.getByDate(lookupDate, token)
      }
      if (!data || (Array.isArray(data) && data.length === 0)) throw new Error()
      setLookupResult(data)
    } catch {
      setError('Nenhum dado encontrado para a busca informada.')
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (!lookupResult || !Array.isArray(lookupResult)) return

    const data = lookupResult as Record<string, unknown>[]
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvRows = []
    csvRows.push(headers.join(','))

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header]
        return `"${val === null || val === undefined ? '' : val}"`
      })
      csvRows.push(values.join(','))
    }

    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `atletas_${lookupDate || lookupId}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', width: '100%', background: 'var(--surface-1)' }}>
      <TopBar title="Dados e Importação" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 14px', paddingBottom: 32 }}>

        {/* Quick Lookup */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--surface-2)', padding: 16, borderRadius: 12, border: '1px solid var(--border-emphasis)' }}>
          <div className="k-section-label">CONSULTA RÁPIDA</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                className="k-field" 
                placeholder="ID do Atleta..." 
                value={lookupId}
                onChange={e => setLookupId(e.target.value)}
                style={{ paddingLeft: 32 }}
              />
              <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-subtle)' }} />
            </div>
            <button className="k-btn-primary" style={{ width: 80 }} onClick={() => handleLookup('id')} disabled={loading || !lookupId}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Ver'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input 
                className="k-field" 
                type="date"
                value={lookupDate}
                onChange={e => setLookupDate(e.target.value)}
                style={{ paddingLeft: 32, colorScheme: 'dark' }}
              />
              <Calendar size={14} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--text-subtle)' }} />
            </div>
            <button className="k-btn-outline" style={{ width: 80 }} onClick={() => handleLookup('date')} disabled={loading || !lookupDate}>
              Buscar
            </button>
          </div>
          
          {lookupResult != null && (
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--success-text)', background: 'var(--success-bg)', padding: 12, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 500 }}>
                {Array.isArray(lookupResult) ? `${lookupResult.length} registros encontrados.` : 'Atleta localizado com sucesso.'}
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Always show Profile link for ID lookup or first result of date lookup */}
                <button 
                  onClick={() => {
                    const item = (Array.isArray(lookupResult) ? lookupResult[0] : lookupResult) as Record<string, unknown>;
                    const id = (item["Athlete ID"] || item.id) as string;
                    if (id) router.push(`/atleta/${id}`);
                  }}
                  style={{ fontSize: 11, textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
                >
                  Abrir perfil ↗
                </button>

                {/* Show Download CSV if it's a date lookup with results */}
                {Array.isArray(lookupResult) && lookupResult.length > 0 && (
                  <button 
                    onClick={downloadCSV}
                    style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer' }}
                  >
                    <Download size={10} /> Baixar CSV
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />

        {/* Stepper */}
        <Stepper current={step} />

        {/* Error message */}
        {error && !lookupResult && (
          <div style={{ padding: 12, background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 10, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Step 1: Reference info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="k-section-label">DATA DE REFERÊNCIA</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 500 }}>DATA DA PARTIDA</label>
                <input
                  className="k-field"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
                <p style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 4 }}>
                  Esta data será usada para todos os registros que não possuírem data própria no arquivo.
                </p>
              </div>
            </div>

            <button
              className="k-btn-primary"
              style={{ width: '100%', marginTop: 8 }}
              disabled={!matchDate}
              onClick={() => setStep(2)}
            >
              Continuar para Upload
            </button>
          </div>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="k-section-label">ARQUIVO DE DADOS (CSV/JSON)</div>

            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                handleFileUpload(e as unknown as React.DragEvent)
              }}
              style={{
                border: `1.5px dashed ${dragging ? 'var(--primary)' : fileName ? 'var(--chart-baseline)' : 'var(--border-muted)'}`,
                borderRadius: 12,
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                background: dragging
                  ? 'rgba(218,165,32,0.05)'
                  : fileName
                  ? 'rgba(29,158,117,0.05)'
                  : 'var(--surface-2)',
                transition: 'all 150ms',
              }}
            >
              <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept=".csv,.json" />
              {fileName ? (
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
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{fileName}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 3 }}>
                      {parsedData.length} registros detectados
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
                      .csv · .json — máx. 50 MB
                    </div>
                  </div>
                </>
              )}
            </label>

            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button className="k-btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>
                Voltar
              </button>
              <button
                className="k-btn-primary"
                style={{ flex: 1 }}
                disabled={!fileName || parsedData.length === 0}
                onClick={() => setStep(3)}
              >
                Analisar Dados
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
                { label: 'Data de Referência', val: matchDate },
                { label: 'Arquivo', val: fileName || '—' },
                { label: 'Registros para Processar', val: `${parsedData.length} atletas` },
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

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="k-btn-outline" style={{ flex: 1 }} onClick={() => setStep(2)}>
                Voltar
              </button>
              <button
                className="k-btn-primary"
                style={{ flex: 1 }}
                onClick={handleConfirmImport}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Confirmar e Importar ↗'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
