import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AppContext } from "./appContextStore";
import { safeStorage } from "../utils/storage";

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth unavailable. Skipping auth listener.");
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        safeStorage.set("userToken", firebaseUser.accessToken);
      } else {
        setUser(null);
        safeStorage.remove("userToken");
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ loading, setLoading, user, logout }}>
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
