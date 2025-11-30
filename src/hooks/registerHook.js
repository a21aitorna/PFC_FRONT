import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";
import es from "../assets/i18n/es.json";

export function useRegister() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    dataBorn: "",
    password: "",
    verifyPassword: "",
    library: "",
    securityQuestion: "",
    answer: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const errorCodeMap = {
    "2001": es.register.requiredFields,
    "2002": es.register.passwordsMismatch,
    "2003": es.register.invalidPassword,
    "2005": es.register.invalidAge,
    "2006": es.register.usernameExists,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //Mapeo con los nombres esperados por el backend
      const payload = {
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        password: formData.password,
        repeat_password: formData.verifyPassword,
        born_date: formData.dataBorn,
        library_name: formData.library,
        security_question: formData.securityQuestion,
        answer: formData.answer,
      };

      const response = await axios.post(`${API_BASE}/register`, payload);

      const data = response.data;

      if (data?.code && errorCodeMap[data.code]) {
        setError(errorCodeMap[data.code]);
        return;
      }

      navigate("/login");

    } catch (err) {
      console.error(err);

      if (err.response) {
        const serverCode = err.response.data?.code;

        if (serverCode && errorCodeMap[serverCode]) {
          setError(errorCodeMap[serverCode]);
        } else {
          setError(es.register.errorInesperado);
        }
      } else {
        setError(es.conexionServidor.errorConexion);
      }

    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    error,
    loading,
  };
}
