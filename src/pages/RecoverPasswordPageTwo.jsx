import es from "../assets/i18n/es.json";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useRecoverPasswordPageTwo } from "../hooks/recoverPasswordPageTwoHook";

import Background from "../components/Background";
import Header from "../components/Header";
import Card from "../components/Card";
import InputText from "../components/InputText";
import InputPassword from "../components/InputPassword";
import Button from "../components/SendButton";
import Footer from "../components/Footer";

export default function RecoverPasswordPageTwo() {
  const {
    username,
    formData,
    error,
    success,
    loading,
    securityQuestion,
    handleChange,
    handleSubmit,
    goBackToLogin,
  } = useRecoverPasswordPageTwo();

  const mostrarHeader = true;

  return (
    <Background>
      {mostrarHeader && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
        </div>
      )}

      <Card
        icon={ShieldCheck}
        title={es.recoverPassword.title}
        subtitle={
          `${es.recoverPassword.subtitle2} ${username}` ||
          `${es.recoverPassword.subtitle2Error}`
        }
        className="relative z-10 bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-w-3xl text-center mt-20"
      >
        {/* Volver al inicio */}
        <button
          onClick={goBackToLogin}
          className="flex items-center text-sm text-gray-500 mb-4 hover:text-indigo-600 transition mx-auto"
          data-testid="loginReturnRecoveryTwo"
        >
          <ArrowLeft size={16} className="mr-1" />
          {es.recoverPassword.returnLogin}
        </button>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          {/* Pregunta de seguridad */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {securityQuestion
                ? securityQuestion
                : `${es.recoverPassword.loadingQuestion}`}
            </label>
            <InputText
              name="answer"
              placeholder={es.recoverPassword.answerPlaceholder}
              value={formData.answer}
              onChange={handleChange}
              data-testid="answerRecovery"
            />
            <p className="text-xs text-gray-400 mt-1">
              {es.recoverPassword.answerHint}
            </p>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {es.recoverPassword.newPasswordField}
            </label>
            <InputPassword
              name="password"
              placeholder={es.recoverPassword.newPasswordPlaceholder}
              value={formData.password}
              onChange={handleChange}
              data-testid="newPasswordRecovery"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {es.recoverPassword.verifyPasswordField}
            </label>
            <InputPassword
              name="confirmPassword"
              placeholder={es.recoverPassword.verifyPasswordPlaceholder}
              value={formData.confirmPassword}
              onChange={handleChange}
              data-testid="repeatNewPasswordRecovery"
            />
          </div>

          {error && (
            <p
              data-testid="errorReason"
              className="text-red-500 text-sm font-medium text-left mt-2"
            >
              {error}
            </p>
          )}

          {/* Botón enviar */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              data-testid="updateButtonRecovery"
            >
              {loading
                ? `${es.recoverPassword.updatingPasswordButton}`
                : `${es.recoverPassword.updatePasswordButton}`}
            </Button>
          </div>

          {/* Mensaje de éxito */}
          {success && (
            <p
              data-testid="successMessage"
              className="text-green-600 text-sm mt-3 text-center"
            >
              {es.recoverPassword.successText}
            </p>
          )}
        </form>

        <div className="fixed bottom-0 left-0 w-full z-50">
            <Footer />
        </div>

      </Card>
    </Background>
  );
}
