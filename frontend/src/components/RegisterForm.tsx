"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "@/lib/api";

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
      await apiService.auth.signup({ name, email, password });

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
    <div className="w-full max-w-md p-8 bg-surface-2 text-fg rounded-2xl shadow-xl border border-border-default">
      <h2 className="text-2xl font-bold mb-6 text-center uppercase tracking-tighter">Criar Conta no <span className="text-primary-strong">Kicker</span></h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-fg-subtle">Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="k-field"
            placeholder="Seu nome"
            required
          />
        </div>

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
          {loading ? "Processando..." : "Cadastrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs font-medium text-fg-muted">
        Já tem uma conta? <Link href="/login" className="text-primary-strong hover:underline">Faça Login</Link>
      </p>
    </div>
  );
}
