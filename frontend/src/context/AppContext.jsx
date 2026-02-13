import { createContext, useState, useEffect } from "react";
import { getUserRole, isTokenExpired } from "../utils/auth";
import { useNavigate } from "react-router-dom"; // Need this but AppContext is wrapped by Router? 
// Wait, usually Buffer/Router wraps App. App wraps ContextProvider? 
// No, usually ContextProvider wraps Router or Router wraps ContextProvider.
// Checking main.jsx or similar...
// In App.jsx:
// <BrowserRouter> 
//    <Routes> ... </Routes>
// </BrowserRouter>
// AppContext is likely used inside App or wrapping App.
// Let's check main.jsx to see where AppProvider is.
// If AppProvider is OUTSIDE Router, we can't use useNavigate.
// If AppProvider is INSIDE Router, we can.
// But better yet, just provide a logout function that clears storage, and components can redirect.
// Or reload the page.

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // Start loading to check auth
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        const role = getUserRole(token);
        setUser({ role, token });
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/login"; // Hard redirect or let components handle it
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