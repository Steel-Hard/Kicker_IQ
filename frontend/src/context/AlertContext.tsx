"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiService } from "@/lib/api";
import { useAuth } from "./AuthContext";

export interface Alert {
  _id: string;
  athleteId: string;
  athleteName: string;
  type: 'carga_elevada' | 'pse_alta' | 'queda_performance' | 'lesao_risco' | 'custom';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  status: 'active' | 'resolved';
  resolvedAt: string | null;
  resolvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mock alerts for development
const mockAlerts: Alert[] = [
  {
    _id: 'mock-1',
    athleteId: '1',
    athleteName: 'Gabriel Silva',
    type: 'carga_elevada',
    severity: 'high',
    title: 'Carga acumulada elevada',
    description: 'Gabriel registrou carga acumulada 38% acima da média das últimas 4 semanas. Considere reduzir intensidade nos próximos treinos.',
    status: 'active',
    resolvedAt: null,
    resolvedBy: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-2',
    athleteId: '6',
    athleteName: 'Bruno Almeida',
    type: 'pse_alta',
    severity: 'high',
    title: 'PSE elevada — 3 sessões consecutivas',
    description: 'Bruno reportou PSE 8,1 por 3 sessões consecutivas. Monitorar sinais de fadiga acumulada e avaliar necessidade de descanso.',
    status: 'active',
    resolvedAt: null,
    resolvedBy: null,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-3',
    athleteId: '5',
    athleteName: 'Diego Santos',
    type: 'queda_performance',
    severity: 'medium',
    title: 'Queda na distância de sprint',
    description: 'Diego apresentou redução de 12% na distância de sprint comparado à média das últimas 3 sessões.',
    status: 'active',
    resolvedAt: null,
    resolvedBy: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-4',
    athleteId: '8',
    athleteName: 'Eduardo Mendes',
    type: 'lesao_risco',
    severity: 'low',
    title: 'Desbalanceamento muscular detectado',
    description: 'Eduardo apresenta diferença de 15% entre acelerações e desacelerações, indicando possível desbalanceamento muscular.',
    status: 'active',
    resolvedAt: null,
    resolvedBy: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-5',
    athleteId: '3',
    athleteName: 'Mateus Oliveira',
    type: 'carga_elevada',
    severity: 'medium',
    title: 'Volume de treino acima do esperado',
    description: 'Mateus acumulou 3120 AU de carga semanal, 18% acima do planejado. Monitorar recuperação.',
    status: 'resolved',
    resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'user-1',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'mock-6',
    athleteId: '2',
    athleteName: 'Rafael Costa',
    type: 'pse_alta',
    severity: 'low',
    title: 'PSE acima da média do grupo',
    description: 'Rafael apresentou PSE 7.4, ligeiramente acima da média do grupo de zagueiros (6.8).',
    status: 'resolved',
    resolvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'user-1',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
];

interface AlertContextType {
  alerts: Alert[];
  activeCount: number;
  loading: boolean;
  error: string | null;
  refreshAlerts: () => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  createAlert: (data: Omit<Alert, '_id' | 'status' | 'resolvedAt' | 'resolvedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const activeCount = alerts.filter(a => a.status === 'active').length;

  const refreshAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (token) {
        const data = await apiService.alerts.getAll(token);
        setAlerts(data as unknown as Alert[]);
      } else {
        // Use mock data when no backend connection
        setAlerts(mockAlerts);
      }
    } catch {
      // Fallback to mock data on API error
      console.warn('Usando dados mock para alertas');
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const resolveAlert = useCallback(async (id: string) => {
    try {
      if (token && !id.startsWith('mock-')) {
        await apiService.alerts.resolve(id, token);
      }
      // Update local state
      setAlerts(prev => prev.map(a =>
        a._id === id
          ? { ...a, status: 'resolved' as const, resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : a
      ));
    } catch (err) {
      console.error("Erro ao resolver alerta", err);
    }
  }, [token]);

  const createAlert = useCallback(async (data: Omit<Alert, '_id' | 'status' | 'resolvedAt' | 'resolvedBy' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (token) {
        try {
          const created = await apiService.alerts.create(data as Record<string, unknown>, token);
          setAlerts(prev => [created as unknown as Alert, ...prev]);
          return;
        } catch {
          // Fallback to local mock creation
        }
      }
      // Create locally with mock ID
      const newAlert: Alert = {
        ...data,
        _id: `mock-${Date.now()}`,
        status: 'active',
        resolvedAt: null,
        resolvedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAlerts(prev => [newAlert, ...prev]);
    } catch (err) {
      console.error("Erro ao criar alerta", err);
    }
  }, [token]);

  const deleteAlert = useCallback(async (id: string) => {
    try {
      if (token && !id.startsWith('mock-')) {
        await apiService.alerts.delete(id, token);
      }
      setAlerts(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error("Erro ao deletar alerta", err);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAlerts();
    } else {
      // Load mock data even without auth for development
      setAlerts(mockAlerts);
    }
  }, [isAuthenticated, refreshAlerts]);

  return (
    <AlertContext.Provider value={{
      alerts, activeCount, loading, error,
      refreshAlerts, resolveAlert, createAlert, deleteAlert,
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
}
