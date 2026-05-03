import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-black">
      {/* Navegação Superior */}
      <header className="px-6 lg:px-20 py-6 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-black text-xl shadow-lg shadow-primary/20">
            K
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Kicker</span>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">Entrar</Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 lg:px-20 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
              Análise de Elite
            </div>
            <h1 className="text-5xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
              <span className="block text-primary drop-shadow-sm">Precisão</span> 
              em cada <span className="text-primary italic underline decoration-secondary decoration-4 underline-offset-8">Chute</span>
            </h1>
            <p className="text-lg lg:text-xl opacity-70 max-w-lg mx-auto lg:mx-0 leading-relaxed text-foreground/80">
              Monitore métricas de desempenho com precisão cirúrgica. 
              Otimize a performance do seu elenco usando nossa plataforma de inteligência esportiva.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/login" className="px-10 py-4 bg-primary text-black font-black rounded-sm text-sm uppercase tracking-widest hover:bg-white transition-colors">
                Ver Jogadores
              </Link>
              <Link href="/login" className="px-10 py-4 border-2 border-primary text-primary font-black rounded-sm text-sm uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                Explorar Dados
              </Link>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Moldura da Imagem (Inspirada no modelo) */}
              <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-3 blur-2xl"></div>
              <div className="absolute inset-0 bg-secondary/10 rounded-2xl -rotate-3 blur-xl"></div>
              <div className="relative h-full w-full rounded-2xl border-4 border-primary/30 bg-zinc-900 overflow-hidden flex items-center justify-center group">
                {/* Placeholder para a imagem do jogador */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50"></div>
                <div className="text-primary text-9xl font-black italic opacity-10 select-none group-hover:scale-110 transition-transform duration-700">KICKER</div>
                <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl">
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-tighter">Destaque da Semana</p>
                  <p className="text-xl font-black uppercase text-white">Análise de Performance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 lg:px-20 py-20 bg-zinc-100 dark:bg-zinc-900/50 border-y border-gray-200 dark:border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-2">
              <p className="text-5xl font-black text-primary tracking-tighter">10.000+</p>
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Jogadores Monitorados</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-secondary tracking-tighter">98%</p>
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Precisão de Dados</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-black text-foreground tracking-tighter">50+</p>
              <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Ligas Atendidas</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 lg:px-20 py-32 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-5xl font-black uppercase italic tracking-tighter">
              A Vantagem da <span className="text-primary">Análise</span>
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Monitoramento de Elite", desc: "Acompanhamento em tempo real de cada membro do seu time em cada minuto jogado.", icon: "📊" },
              { title: "QI Tático", desc: "Simulações avançadas que preveem resultados baseados em formações históricas.", icon: "🧠" },
              { title: "Rankings Globais", desc: "Sistema de avaliação de jogadores unificado em todas as ligas mundiais.", icon: "🌍" }
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl hover:border-primary/50 transition-all group">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 lg:px-20 py-32">
          <div className="bg-primary p-12 lg:p-20 rounded-[40px] text-black flex flex-col lg:flex-row justify-between items-center gap-12 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
            <div className="space-y-6 relative z-10 text-center lg:text-left">
              <h2 className="text-4xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
                Junte-se <br />à Elite
              </h2>
              <p className="font-bold opacity-70 max-w-md">Pronto para transformar as decisões do seu elenco em uma arma estratégica?</p>
            </div>
            <Link href="/login" className="px-12 py-6 bg-black text-white font-black rounded-full uppercase tracking-widest hover:scale-110 transition-all relative z-10 shadow-2xl">
              Começar a usar
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 lg:px-20 py-12 border-t border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50 text-[10px] uppercase font-bold tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span>Kicker IQ Analytics</span>
          <span className="hidden md:block">|</span>
          <span>© 2026 Steel Hard</span>
        </div>
        <div className="flex gap-8">
          <a href="https://github.com/Steel-Hard/Kicker_IQ" className="hover:text-primary transition-colors">Privacidade</a>
          <a href="https://github.com/Steel-Hard/Kicker_IQ" className="hover:text-primary transition-colors">Termos</a>
          <a href="https://github.com/Steel-Hard/Kicker_IQ" className="hover:text-primary transition-colors">Suporte</a>
        </div>
      </footer>
    </div>
  );
}
