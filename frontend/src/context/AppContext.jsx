import { useState, useEffect } from "react";
import api from "../api/axios";
import { AppContext } from "./appContextStore";
import { safeStorage } from "../utils/storage";

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = safeStorage.get("accessToken");
    if (!token) return;

    setLoading(true);
    api
      .get("/auth/me")
      .then((res) => {
        const profile = res.data.user;
        setUser(profile);
        safeStorage.set("role", profile.role);
      })
      .catch(() => {
        safeStorage.remove("accessToken");
        safeStorage.remove("role");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      safeStorage.remove("accessToken");
      safeStorage.remove("role");
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ loading, setLoading, user, setUser, logout }}>
      {loading && <FullScreenLoader />}
      {children}
    </AppContext.Provider>
  );
};

function FullScreenLoader() {
  return (
    <div style={styles.overlay}>
      <div style={styles.spinner}></div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  spinner: {
    width: 50,
    height: 50,
    border: "5px solid #ddd",
    borderTop: "5px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
