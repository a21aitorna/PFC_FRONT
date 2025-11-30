import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";
import es from "../assets/i18n/es.json";

export function useRecoverPasswordPageOne() {
  const [usuario, setUsuario] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const errorCodeMap = {
    "1004": es.recoverPassword.userNotFound,
    "3001": es.recoverPassword.verifyUserEmptyField,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/recover-password/verify-user`, {
        username: usuario,
      });

      const data = response.data;

      if (data?.code && errorCodeMap[data.code]) {
        setError(errorCodeMap[data.code]);
        return;
      }

      navigate("/recover-password-enter-new-password", { state: { username: usuario } });

    } catch (err) {

      if (err.response) {
        const serverCode = err.response.data?.code;

        if (serverCode && errorCodeMap[serverCode]) {
          setError(errorCodeMap[serverCode]);
        } else {
          setError(es.recoverPassword.errorInesperado);
        }
      } else {
        setError(es.conexionServidor.errorConexion);
      }

    } finally {
      setLoading(false);
    }
  };

  return {
    usuario,
    setUsuario,
    handleSubmit,
    error,
    loading,
  };
}
