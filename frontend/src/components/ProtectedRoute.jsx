```javascript
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AppContext);

  if (loading) return <div>Loading...</div>; // Or return null to show the global loader from AppContext

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role or to a generic unauthorized page
    // For now, redirect to login or home to avoid infinite loops if dashboard is also protected
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```
