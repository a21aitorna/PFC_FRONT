import es from "../assets/i18n/es.json"
import { Lock } from "lucide-react";
import { useLogin } from "../hooks/loginHook";

import Background from "../components/Background";
import Header from "../components/Header";
import Card from "../components/Card";
import InputText from "../components/InputText";
import InputPassword from "../components/InputPassword";
import Button from "../components/SendButton";
import Footer from "../components/Footer";



export default function Login() {
  const { usuario, password, error, setUsuario, setPassword, handleSubmit } = useLogin();

  const mostrarHeader = true;

  return (
    <Background data-testid="login-background">
      {mostrarHeader && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
        </div>
      )}

     <div className="flex flex-col items-center justify-center w-full min-h-screen pt-24 pb-16 px-4">
        <Card
          icon={Lock}
          title={es.login.title}
          subtitle={es.login.subtitle}
          className="relative z-10 bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] max-w-3xl text-center "
        >
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            {/* Input usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es.login.usernameField}
              </label>
              <InputText
                data-testid="usernameLogin"
                placeholder={es.login.usernamePlaceholder}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            {/* Input contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {es.login.passwordField}
              </label>
              <InputPassword
                data-testid="passwordLogin"
                placeholder={es.login.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-right mt-1">
                <a href="/recover-password-verify-user" className="text-xs text-indigo-600 hover:underline" data-testid="forgottenPasswordLogin">
                  {es.login.forgotPassword}
                </a>
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <p data-testid="errorReason" className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <Button type="submit" data-testid="loginRegisterButton">{es.login.loginButton}</Button>
          </form>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>
    </Background>
  );
}
