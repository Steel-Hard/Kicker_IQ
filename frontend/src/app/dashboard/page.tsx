"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      requestAnimationFrame(() => {
        setUser(parsedUser);
      });
    }
  }, []);

  // Mock de jogadores para base do projeto
  const mockPlayers = [
    { id: 1, name: "Lucas Silva", position: "Atacante", rating: 85, accuracy: "92%" },
    { id: 2, name: "Mateus Santos", position: "Meio-Campo", rating: 82, accuracy: "88%" },
    { id: 3, name: "Gabriel Oliveira", position: "Zagueiro", rating: 79, accuracy: "75%" },
    { id: 4, name: "Rafael Costa", position: "Goleiro", rating: 88, accuracy: "95%" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-black text-xs">
            IQ
          </div>
          <span className="text-lg font-bold">Painel Kicker</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-70 hidden sm:inline">Olá, {user?.name || "Usuário"}</span>
          <ThemeToggle />
          <Link href="/login" onClick={() => localStorage.clear()} className="text-xs font-medium hover:text-primary transition-colors">
            Sair
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Análise de Jogadores</h1>
            <p className="opacity-60">Monitore o desempenho e estatísticas em tempo real.</p>
          </div>
          <button className="px-6 py-2 bg-primary text-black font-bold rounded-full text-sm hover:opacity-90 transition-all">
            + Novo Jogador
          </button>
        </div>

        {/* Grid de Jogadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockPlayers.map((player) => (
            <div key={player.id} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4 flex items-center justify-center overflow-hidden">
                <div className="text-xl">⚽</div>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{player.name}</h3>
              <p className="text-sm opacity-60 mb-4">{player.position}</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div>
                  <p className="text-[10px] uppercase tracking-wider opacity-40">Rating</p>
                  <p className="font-bold text-secondary">{player.rating}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider opacity-40">Precisão</p>
                  <p className="font-bold text-primary">{player.accuracy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-8 text-center opacity-40 text-[10px] uppercase tracking-widest">
        Kicker IQ Data Engine v1.0
      </footer>
    </div>
  );
}
