"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3030/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      setSuccess("Conta criada com sucesso! Redirecionando...");
      
      // Auto-login or redirect to login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-center italic uppercase tracking-tighter">Criar Conta no <span className="text-primary">Kicker</span></h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1 opacity-50">Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="Seu nome"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1 opacity-50">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1 opacity-50">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs font-bold mt-2">{error}</p>
        )}
        
        {success && (
          <p className="text-green-500 text-xs font-bold mt-2">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary hover:opacity-90 text-black font-black uppercase tracking-widest rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {loading ? "Processando..." : "Cadastrar"}
        </button>
      </form>
      
      <p className="mt-6 text-center text-xs font-medium opacity-60">
        Já tem uma conta? <Link href="/login" className="text-secondary hover:underline">Faça Login</Link>
      </p>
    </div>
  );
}
