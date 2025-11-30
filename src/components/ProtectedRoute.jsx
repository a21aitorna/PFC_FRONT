import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Si no hay token ni usuario, redirige al login
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Si está logueado, renderiza el componente hijo
  return <Outlet />;
}
