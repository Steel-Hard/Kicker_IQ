"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiService } from "@/lib/api";
import { useAuth } from "./AuthContext";
import type { Athlete, AthleteProfile } from "@/lib/mock-data";

interface AthleteContextType {
  athletes: Athlete[];
  loading: boolean;
  error: string | null;
  refreshAthletes: () => Promise<void>;
  getAthleteById: (id: string) => Promise<Athlete | null>;
  mapBackendToAthlete: (b: Record<string, unknown>) => Athlete;
  getHistoricalScores: (id: string) => Promise<Athlete['clusterScores'] | null>;
  predictMatch: (metrics: Record<string, unknown>) => Promise<any>;
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export function AthleteProvider({ children }: { children: React.ReactNode }) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  const mapBackendToAthlete = useCallback((b: Record<string, unknown>): Athlete => {
    const get = (keys: string[]) => {
      for (const k of keys) {
        if (b[k] !== undefined && b[k] !== null) return b[k];
      }
      return null;
    };

    const id = String(get(["Athlete ID", "athlete_id", "id"]) || "");
    const name = String(get(["Name", "name", "Full Name"]) || "Atleta Desconhecido");
    const pos = String(get(["Position", "Athlete Position", "position", "athlete_position"]) || "N/A");
    const grp = String(get(["Groups", "Athlete Groups", "group", "athlete_group"]) || "N/A");

    let profile: AthleteProfile = (b.profile as AthleteProfile) || "baixa";
    let profileLabel = (b.profileLabel as string) || "N/A";

    if (b.clusterScores) {
      const scores = b.clusterScores as Record<string, number>;
      const entries = Object.entries(scores);
      if (entries.length > 0) {
        const highest = entries.reduce((a, b) => a[1] > b[1] ? a : b);
        const key = highest[0].toLowerCase();
        profile = (key === 'resistente' ? 'resist' : 
                  key === 'baixo_volume' ? 'baixa' : 
                  key === 'moderado' ? 'BAIXA' : 
                  key) as AthleteProfile;
        profileLabel = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
      }
    }

    return {
      id,
      name,
      initials: name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
      number: Number(get(["Number", "number"]) || 0),
      position: pos,
      group: grp,
      profile,
      profileLabel,
      age: Number(get(["Age", "age"]) || 0),
      speed: Number(get(["Top Speed (kph)", "Top Speed", "speed", "top_speed"]) || 0),
      sprintDistance: Number(get(["Sprint Distance (m)", "Sprint Distance", "sprint_distance"]) || 0),
      weeklyLoad: Number(get(["Session Load", "weeklyLoad", "load"]) || 0),
      pse: Number(get(["PSE", "pse"]) || 0),
      speedDelta: Number(b.speedDelta || 0),
      sprintDelta: Number(b.sprintDelta || 0),
      loadDelta: Number(b.loadDelta || 0),
      pseDelta: Number(b.pseDelta || 0),
      hasAlert: !!b.hasAlert,
      alertTitle: b.alertTitle as string,
      alertDesc: b.alertDesc as string,
      radar: (b.radar as Athlete['radar']) || { 
        velocidade: 50, resistencia: 50, explosividade: 50, carga: 50, recuperacao: 50, tecnica: 50 
      },
      matchHistory: (b.matchHistory as Athlete['matchHistory']) || [],
      clusterScores: b.clusterScores as Athlete['clusterScores'],
      metrics: {
        distanceM: Number(get(["Distance (m)", "distance"]) || 0),
        metresPerMinuteM: Number(get(["Metres per Minute (m)", "metres_per_minute"]) || 0),
        highIntensityRunningM: Number(get(["High Intensity Running (m)", "high_intensity_running"]) || 0),
        noHighIntensityEvents: Number(get(["No. of High Intensity Events", "high_intensity_events"]) || 0),
        noSprints: Number(get(["No. of Sprints", "no_sprints"]) || 0),
        rawTopSpeedKph: Number(get(["Raw Top Speed (kph)", "raw_top_speed"]) || 0),
        topSpeedKph: Number(get(["Top Speed (kph)", "top_speed"]) || 0),
        avgSpeedKph: Number(get(["Avg Speed (kph)", "avg_speed"]) || 0),
        accelerations: Number(get(["Accelerations", "accelerations"]) || 0),
        decelerations: Number(get(["Decelerations", "decelerations"]) || 0),
        durationMins: Number(get(["Duration (mins)", "duration"]) || 0),
        workloadIntensity: b["Workload Intensity"] ? Number(b["Workload Intensity"]) : null,
        pctMaxSpeed: b["Percentage of Max Speed"] ? Number(b["Percentage of Max Speed"]) : null,
        pctRawMaxSpeedKph: b["Percentage of Raw Max Speed KPH"] ? Number(b["Percentage of Raw Max Speed KPH"]) : null,
      }
    };
  }, []);

  const getHistoricalScores = useCallback(async (id: string): Promise<Athlete['clusterScores'] | null> => {
    if (!token) return null;
    try {
      const prediction = await apiService.model.getProfile(id, token);
      return prediction as unknown as Athlete['clusterScores'];
    } catch (err) {
      console.error("Error fetching historical scores", err);
      return null;
    }
  }, [token]);

  const predictMatch = useCallback(async (metrics: Record<string, unknown>) => {
    if (!token) return null;
    try {
      return await apiService.model.predict(metrics, token);
    } catch (err) {
      console.error("Prediction failed", err);
      return null;
    }
  }, [token]);

  const refreshAthletes = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.athletes.getAll(token);
      
      const enrichedAthletes = await Promise.all(data.map(async (b: Record<string, unknown>) => {
        const athleteId = String(b["Athlete ID"] || b.id);
        try {
          const scores = await apiService.model.getProfile(athleteId, token);
          return mapBackendToAthlete({ ...b, clusterScores: scores });
        } catch {
          return mapBackendToAthlete(b);
        }
      }));
      
      setAthletes(enrichedAthletes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar atletas");
    } finally {
      setLoading(false);
    }
  }, [token, mapBackendToAthlete]);

  const getAthleteById = useCallback(async (id: string): Promise<Athlete | null> => {
    if (!token) return null;
    try {
      const data = await apiService.athletes.getById(id, token);
      const b = (Array.isArray(data) ? data[0] : data) as Record<string, unknown>;
      if (!b) return null;
      
      try {
        const scores = await apiService.model.getProfile(id, token);
        return mapBackendToAthlete({ ...b, clusterScores: scores });
      } catch {
        return mapBackendToAthlete(b);
      }
    } catch (err) {
      console.error("Error fetching athlete", err);
      return null;
    }
  }, [token, mapBackendToAthlete]);

  useEffect(() => {
    if (isAuthenticated) {
      requestAnimationFrame(() => {
        refreshAthletes();
      });
    }
  }, [isAuthenticated, refreshAthletes]);

  return (
    <AthleteContext.Provider value={{ 
      athletes, loading, error, refreshAthletes, getAthleteById, 
      mapBackendToAthlete, getHistoricalScores, predictMatch 
    }}>
      {children}
    </AthleteContext.Provider>
  );
}

export function useAthletes() {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error("useAthletes must be used within an AthleteProvider");
  }
  return context;
}
