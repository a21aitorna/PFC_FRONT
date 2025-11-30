import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/userProvider";

export function PublicRoute() {
  const { user } = useUser();

  if (user) {
    return <Navigate to={`/library/${user.id_user}`} replace />;
  }

  return <Outlet />;
}
