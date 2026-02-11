import { NavLink } from "react-router-dom";

import { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const getRole = (user) =>
  user?.role || localStorage.getItem("role") || "customer";

import { useContext } from "react";
import { AppContext } from "../context/appContextStore";
import { safeStorage } from "../utils/storage";

const getRole = (user) => user?.role || safeStorage.get("role") || "customer";


export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const role = getRole(user);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // ✅ Hooks must be above early return
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user) return null;

  const dashboardRoute =
    role === "superadmin"
      ? "/superadmin"
      : role === "admin"
        ? "/admin"
        : role === "driver"
          ? "/driver"
          : "/dashboard";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <NavLink to={dashboardRoute} className="navbar-brand">
          <span aria-hidden>🚚</span>
          Fleetiva Roadlines
        </NavLink>

        <div className="navbar-links">
          <NavLink to={dashboardRoute} className="nav-link">
            Dashboard
          </NavLink>

          {role === "customer" && (
            <NavLink to="/post-load" className="nav-link">
              Post Load
            </NavLink>
          )}

          {role === "driver" && (
            <NavLink to="/post-truck" className="nav-link">
              Post Truck
            </NavLink>
          )}
        </div>

        <div className="navbar-actions" ref={dropdownRef}>
          <div
            className="avatar"
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer" }}
          >
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          {open && (
            <div className="dropdown-menu">
              <NavLink to="/profile" className="dropdown-item">
                👤 My Profile
              </NavLink>
              <NavLink to="/stats" className="dropdown-item">
                📊 My Stats
              </NavLink>
              <NavLink to="/my-loads" className="dropdown-item">
                🚚 My Loads
              </NavLink>

              <div className="dropdown-divider" />
              <button className="dropdown-item logout" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
