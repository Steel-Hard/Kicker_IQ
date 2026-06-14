import Link from 'next/link'
import Image from "next/image";
import { BarChart3, BrainCircuit, Globe } from "lucide-react";
import Header from "@/components/Header";

const features = [
  { title: "Monitoramento de Elite", desc: "Acompanhamento em tempo real de cada membro do seu time em cada minuto jogado.", Icon: BarChart3 },
  { title: "QI Tático", desc: "Simulações avançadas que preveem resultados baseados em formações históricas.", Icon: BrainCircuit },
  { title: "Rankings Globais", desc: "Sistema de avaliação de jogadores unificado em todas as ligas mundiais.", Icon: Globe },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-1 text-fg font-sans">
      <Header showLink={true} />

      <main className="flex-1">
        <section className="px-6 lg:px-20 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          <div className="flex-1 space-y-7 relative z-10 text-center lg:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-strong text-[10px] font-bold uppercase tracking-widest">
              Análise de Elite
            </div>
            <h1 className="text-5xl lg:text-8xl font-bold leading-[0.95] tracking-tighter uppercase">
              <span className="block text-primary-strong">Precisão</span>
              em cada <span className="text-primary-strong underline decoration-primary decoration-4 underline-offset-8">Chute</span>
            </h1>
            <p className="text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed text-fg-secondary">
              Monitore métricas de desempenho com precisão cirúrgica.
              Otimize a performance do seu elenco usando nossa plataforma de inteligência esportiva.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-6">
              <Link href="/login" className="inline-flex items-center justify-center h-12 px-10 bg-primary-strong text-black font-bold rounded-md text-sm uppercase tracking-widest hover:bg-(--primary-strong-hover) transition-colors">
                Ver Jogadores
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center h-12 px-10 border border-primary-strong text-primary-strong font-bold rounded-md text-sm uppercase tracking-widest hover:bg-primary-strong hover:text-black transition-colors">
                Explorar Dados
              </Link>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-3 blur-2xl"></div>
              <div className="absolute inset-0 bg-primary-strong/10 rounded-2xl -rotate-3 blur-xl"></div>
              <div className="relative h-full w-full rounded-2xl border-2 border-primary/30 bg-surface-3 overflow-hidden flex items-center justify-center group">
                <Image
                  src="/kicker_promotional_img.png"
                  alt="Kicker Promotional Image"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-20 py-20 bg-surface-2 border-y border-border-default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-bold text-primary-strong tracking-tighter">10.000+</p>
              <p className="text-xs font-bold text-fg-subtle uppercase tracking-widest">Jogadores Monitorados</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold text-primary-strong tracking-tighter">98%</p>
              <p className="text-xs font-bold text-fg-subtle uppercase tracking-widest">Precisão de Dados</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-bold text-primary-strong tracking-tighter">50+</p>
              <p className="text-xs font-bold text-fg-subtle uppercase tracking-widest">Ligas Atendidas</p>
            </div>
          </div>
        </section>

        <section className="px-6 lg:px-20 py-24 lg:py-32 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold uppercase tracking-tighter">
              A Vantagem da <span className="text-primary-strong">Análise</span>
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ title, desc, Icon }, i) => (
              <div key={i} className="p-8 lg:p-10 bg-surface-2 border border-border-default rounded-2xl hover:border-primary/50 transition-colors group">
                <Icon className="w-9 h-9 mb-8 text-fg-muted group-hover:text-primary-strong transition-colors" strokeWidth={1.5} />
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight group-hover:text-primary-strong transition-colors">{title}</h3>
                <p className="text-sm text-fg-secondary leading-loose">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 lg:px-20 py-16 lg:py-32">
          <div className="bg-primary-strong p-8 lg:p-20 rounded-2xl text-black flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            <div className="space-y-4 relative z-10 text-center lg:text-left">
              <h2 className="text-4xl lg:text-6xl font-bold uppercase tracking-tighter leading-none text-black">
                Junte-se <br />à Elite
              </h2>
              <p className="font-semibold text-black max-w-md">Pronto para transformar as decisões do seu elenco em uma arma estratégica?</p>
            </div>
            <Link href="/login" className="inline-flex items-center justify-center h-12 px-12 bg-black text-white font-bold rounded-md uppercase tracking-widest hover:opacity-90 transition-opacity relative z-10 shadow-2xl whitespace-nowrap">
              Começar a usar
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 lg:px-20 py-12 border-t border-border-default flex flex-col md:flex-row justify-between items-center gap-8 text-fg-subtle text-[10px] uppercase font-bold tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span>Kicker</span>
          <span className="hidden md:block">|</span>
          <span>© 2026 Steel Hard</span>
        </div>
        <div className="flex gap-8">
          <a href="https://github.com/Steel-Hard/Kicker_IQ" className="hover:text-primary-strong transition-colors">Privacidade</a>
          <a href="https://github.com/Steel-Hard/Kicker_IQ" className="hover:text-primary-strong transition-colors">Termos</a>
          <a href="https://github.com/Steel-Hard/Kicker_IQ" className="hover:text-primary-strong transition-colors">Suporte</a>
        </div>
      </footer>
    </div>
  );
}
