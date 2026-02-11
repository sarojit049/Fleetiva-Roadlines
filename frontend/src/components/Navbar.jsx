import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/appContextStore";
import { safeStorage } from "../utils/storage";

const getRole = (user) => user?.role || safeStorage.get("role") || "customer";

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const role = getRole(user);

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
          {role === "superadmin" && (
            <>
              <NavLink to="/superadmin" className="nav-link">
                Company Management
              </NavLink>
              <NavLink to="/superadmin/logs" className="nav-link">
                System Logs
              </NavLink>
            </>
          )}
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

        <div className="navbar-actions">
          <span className="chip">{user?.email || "Signed in"}</span>
          <span className="chip">Role: {role}</span>
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
