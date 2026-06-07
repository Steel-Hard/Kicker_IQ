/**
 * API Service layer to decouple components from direct fetch calls.
 * Uses NEXT_PUBLIC_API_URL environment variable.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro na requisição");
  }

  return data as T;
}

export const apiService = {
  post: <T>(endpoint: string, body: unknown) => 
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
    
  get: <T>(endpoint: string, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return request<T>(endpoint, { method: "GET", headers });
  },

  // Auth specific methods
  auth: {
    signin: (credentials: Record<string, unknown>) => apiService.post<{ token: string, user: { name: string } }>("/auth/signin", credentials),
    signup: (userData: Record<string, unknown>) => apiService.post<unknown>("/auth/signup", userData),
    google: (idToken: string) => apiService.post<unknown>(`/auth/google/${idToken}`, {}),
  },

  // Athlete specific methods
  athletes: {
    getAll: (token: string) => apiService.get<Record<string, unknown>[]>("/athletes", token),
    getById: (id: string, token: string) => apiService.get<Record<string, unknown>>(`/athletes/${id}`, token),
    getByDate: (date: string, token: string) => apiService.get<Record<string, unknown>[]>(`/athletes/date/${date}`, token),
    import: (records: Record<string, unknown>[], token: string) => 
      request<{ message: string }>("/athletes/import", {
        method: "POST",
        body: JSON.stringify({ records }),
        headers: { "Authorization": `Bearer ${token}` }
      }),
  },

  // Model specific methods
  model: {
    predict: (metrics: Record<string, unknown>, token: string) => 
      request<{ clusterName: string; [key: string]: unknown }>("/model/predict", { 
        method: "POST", 
        body: JSON.stringify(metrics),
        headers: { "Authorization": `Bearer ${token}` }
      }),
    getProfile: (id: string, token: string) =>
      request<{ clusterName: string; [key: string]: unknown }>(`/model/predict?id=${id}`, {
        method: "POST", // The backend route is POST
        headers: { "Authorization": `Bearer ${token}` }
      }),
  },

  // Alert specific methods
  alerts: {
    getAll: (token: string, filters?: { status?: string; severity?: string; athleteId?: string }) => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.severity) params.append("severity", filters.severity);
      if (filters?.athleteId) params.append("athleteId", filters.athleteId);
      const qs = params.toString();
      return apiService.get<Record<string, unknown>[]>(`/alerts${qs ? `?${qs}` : ""}`, token);
    },
    getCount: (token: string) =>
      apiService.get<{ count: number }>("/alerts/count", token),
    getByAthlete: (id: string, token: string) =>
      apiService.get<Record<string, unknown>[]>(`/alerts/athlete/${id}`, token),
    create: (data: Record<string, unknown>, token: string) =>
      request<Record<string, unknown>>("/alerts", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${token}` },
      }),
    resolve: (id: string, token: string) =>
      request<Record<string, unknown>>(`/alerts/${id}/resolve`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` },
      }),
    delete: (id: string, token: string) =>
      request<{ message: string }>(`/alerts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      }),
  },
};
