"use client";

import React from "react";
import { AthleteCard } from "./athlete-card";
import type { Athlete } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";

interface AthleteListProps {
  athletes: Athlete[];
  loading?: boolean;
  emptyMessage?: string;
}

export function AthleteList({ athletes, loading, emptyMessage = "Nenhum atleta encontrado" }: AthleteListProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: 'var(--text-subtle)' }}>
        <Loader2 className="animate-spin" size={24} />
        <span style={{ marginLeft: 8 }}>Carregando...</span>
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-subtle)', fontSize: 13 }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {athletes.map((athlete) => (
        <AthleteCard key={athlete.id} athlete={athlete} />
      ))}
    </div>
  );
}
