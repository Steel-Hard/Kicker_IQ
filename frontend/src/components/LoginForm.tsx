"use client";
import React, { useState } from "react";
import Link from "next/link";
import { apiService } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function LoginForm() {
  const { login } = useAuth();
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
      const data = await apiService.auth.signin({ email, password });

      setSuccess("Login realizado com sucesso!");
      login(data.user, data.token);
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
    <div className="w-full max-w-md p-8 bg-surface-2 rounded-2xl shadow-xl border border-border-default text-fg">
     <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tighter">Entrar no <span className="text-primary-strong">Kicker</span></h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-fg-subtle">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="k-field"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-fg-subtle">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="k-field"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <p className="text-kicker-danger text-xs font-bold mt-2">{error}</p>
        )}

        {success && (
          <p className="text-kicker-success text-xs font-bold mt-2">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="k-btn-primary w-full uppercase tracking-widest"
        >
          {loading ? "Processando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase font-bold">
          <span className="bg-surface-2 px-2 text-fg-subtle">Ou continue com</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          console.log("Iniciando Login com Google...");
          setError("Integração do Google Auth requer configuração de CLIENT_ID no frontend.");
        }}
        className="mt-4 w-full h-11 border border-border-default rounded-md flex items-center justify-center gap-3 hover:bg-surface-3 transition-colors font-bold text-sm text-fg"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Google
      </button>
      
      <p className="mt-6 text-center text-xs font-medium text-fg-muted">
        Não tem uma conta? <Link href="/register" className="text-primary-strong hover:underline">Cadastre-se</Link>
      </p>
    </div>
  );
}
