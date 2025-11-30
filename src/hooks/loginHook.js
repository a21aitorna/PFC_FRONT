import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";
import es from "../assets/i18n/es.json";
import { useUser } from "../context/userProvider";

export function useLogin() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, logout } = useUser();

  const errorCodeMap = {
    "1001": es.login.requiredFields,
    "1002": es.login.requiredUsername,
    "1003": es.login.requiredPassword,
    "1013": es.login.blockedUserLogin,
    "1014": es.login.deletedUserLogin
  };

  // Mapeo de id_role a rutas y nombres de rol
  const roleMap = {
    1: { name: "admin", path: "/admin-panel" },
    2: { name: "usuario", path: (userId) => `/library/${userId}` } // ruta dinámica con userId
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        username: usuario,
        password: password,
      });

      const data = response.data;

      if (data?.code && errorCodeMap[data.code]) {
        setError(errorCodeMap[data.code]);
        return;
      }

      logout();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);

      const roleInfo = roleMap[data.user.id_role];
      if (roleInfo) {
        if (data.user.id_role === 2) {
          // Usuario normal → ruta dinámica con su id
          navigate(roleInfo.path(data.user.id_user));
        } else {
          // Admin → ruta estática
          navigate(roleInfo.path);
        }
        console.log("Usuario recibido tras login:", data.user);
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);

      if (err.response) {
        const serverCode = err.response.data?.code;

        if (serverCode && errorCodeMap[serverCode]) {
          setError(errorCodeMap[serverCode]);
          return;
        }

        navigate("/register");

      } else {
        setError(es.conexionServidor.errorConexion);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    usuario,
    password,
    error,
    setUsuario,
    setPassword,
    handleSubmit,
    loading,
  };
}
