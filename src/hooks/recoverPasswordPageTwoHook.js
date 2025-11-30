import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";
import es from "../assets/i18n/es.json"

export function useRecoverPasswordPageTwo() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const username = state?.username || "";

  const errorCodeMap = {
    "3001": es.recoverPassword.emptyFields,
    "3003": es.recoverPassword.answerMismatch,
    "3004": es.recoverPassword.passwordsMismatch,
    "3005": es.recoverPassword.invalidPassword,
    "3007": es.recoverPassword.userNotFound,
    "3008": es.recoverPassword.passwordAlreayUsed,
  };

  const [formData, setFormData] = useState({
    answer: "",
    password: "",
    confirmPassword: "",
  });

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener la pregunta de seguridad
  useEffect(() => {
    const fetchSecurityQuestion = async () => {
      if (!username) return;
      try {
        const res = await axios.get(
          `${API_BASE}/recover-password/security-question`,
          { params: { username } }
        );
        setSecurityQuestion(res.data.security_question);
      } catch (err) {
        setError(es.recoverPassword.questionNotObtained);
      }
    };

    fetchSecurityQuestion();
  }, [username]);

  // Cambiar campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_BASE}/recover-password/update-password`,
        {
          username,
          answer: formData.answer,
          password: formData.password,
          repeat_password: formData.confirmPassword,
        },
        {
          validateStatus: () => true, // Evita error por status != 2xx
        }
      );

      const isSuccess =
        response.data.success === true ||
        response.data.status === true ||
        response.data.status === "ok" ||
        response.status === 200;

      if (isSuccess) {
        setSuccess(true);
        setFormData({ answer: "", password: "", confirmPassword: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        const customMsg =
          errorCodeMap[response.data.code] ||
          response.data.message || es.recoverPassword.returnLoginError;
        setError(customMsg);
      }
    } catch (err) {
      if (err.response) {
        const msg =
          errorCodeMap[err.response.data?.code] ||
          err.response.data?.message;
        setError(msg);
      } else if (err.request) {
        setError(es.conexionServidor.errorConexion);
      }
    } finally {
      setLoading(false);
    }
  };

  const goBackToLogin = () => navigate("/login");

  return {
    username,
    formData,
    error,
    success,
    loading,
    securityQuestion,
    handleChange,
    handleSubmit,
    goBackToLogin,
  };
}
