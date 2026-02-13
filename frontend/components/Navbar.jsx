import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <Link to="/" className="text-xl font-bold">Fleetiva</Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            {user.role === "customer" && <Link to="/dashboard">Dashboard</Link>}
            <button onClick={logout} className="px-3 py-1 bg-black text-white rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}
