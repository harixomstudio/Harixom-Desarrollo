// src/context/AppDataContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import axios from "axios";

interface Publication {
  id: number;
  user_id?: number;
  user_name?: string;
  user_profile_picture?: string;
  description?: string;
  image?: string;
  total_likes?: number;
  total_comments?: number;
  category?: string;
  created_at?: string;
}

interface AppDataContextProps {
  currentUser: any;
  publications: Publication[];
  loading: boolean;
  refreshData: () => void;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  const loadData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [userRes, publicationsRes] = await Promise.all([
        axios.get("https://harixom-desarrollo.onrender.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("https://harixom-desarrollo.onrender.com/api/publications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCurrentUser(userRes.data.user);
      setPublications(publicationsRes.data.publications);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Carga inicial
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refrescado automático cada 30s
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, loadData]);

  return (
    <AppDataContext.Provider
      value={{
        currentUser,
        publications,
        loading,
        refreshData: loadData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context)
    throw new Error("useAppData debe usarse dentro de AppDataProvider");
  return context;
};
