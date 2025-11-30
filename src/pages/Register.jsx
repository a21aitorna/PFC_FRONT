import es from "../assets/i18n/es.json";
import { useRegister } from "../hooks/registerHook";

import Background from "../components/Background";
import Header from "../components/Header";
import Card from "../components/Card";
import InputText from "../components/InputText";
import InputPassword from "../components/InputPassword";
import Button from "../components/SendButton";
import Footer from "../components/Footer";


export default function Register() {
  const { formData, handleChange, handleSubmit, error, loading } = useRegister();

  const campos = [
    { name: "name", placeholder: es.register.namePlaceholder, type: "text", data_testid: "nameRegister" },
    { name: "surname", placeholder: es.register.surnamePlaceholder, type: "text", data_testid: "surnameRegister" },
    { name: "username", placeholder: es.register.usernamePlaceholder, type: "text", data_testid: "usernameRegister" },
    { name: "dataBorn", placeholder: es.register.birthDatePlaceholder, type: "date", data_testid: "birthdayRegister" },
    { name: "password", placeholder: es.register.passwordPlaceholder, type: "password", data_testid: "passwordRegister" },
    { name: "verifyPassword", placeholder: es.register.verifyPasswordPlaceholder, type: "password", data_testid: "verifyPasswordRegister" },
    { name: "library", placeholder: es.register.libraryNamePlaceholder, type: "text", data_testid: "libraryRegister" },
    { name: "securityQuestion", placeholder: es.register.securityQuestionPlaceholder, type: "text", data_testid: "securityQuestionRegister" },
    { name: "answer", placeholder: es.register.answerPlaceholder, type: "text", data_testid: "answerField" },
  ];

  return (
    <Background data-testid="register-background" className="overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50 h-[64px]">
        <Header />
      </div>

      <div className="flex items-center justify-center h-[calc(100vh-128px)] px-4">
        <Card title={es.register.title}
              className="bg-white rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {campos
                .filter((c) => c.name === "name" || c.name === "surname")
                .map((campo) => (
                  <InputText
                    key={campo.name}
                    placeholder={campo.placeholder}
                    name={campo.name}
                    value={formData[campo.name]}
                    onChange={handleChange}
                    data-testid={campo.data_testid}
                  />
                ))}
            </div>


            {campos
              .filter((c) => c.name !== "name" && c.name !== "surname")
              .map((campo) =>
                campo.type === "password" ? (
                  //Campos de contraseña
                  <InputPassword
                    key={campo.name}
                    placeholder={campo.placeholder}
                    name={campo.name}
                    value={formData[campo.name]}
                    onChange={handleChange}
                    data-testid={campo.data_testid}
                  />
                ) : (
                  // Resto de campos
                  <InputText
                    key={campo.name}
                    type={campo.type}
                    placeholder={campo.placeholder}
                    name={campo.name}
                    value={formData[campo.name]}
                    onChange={handleChange}
                    data-testid={campo.data_testid}
                  />
                )
              )}

            {/* Mensaje de error */}
            {error && 
              <p data-testid="errorReason" className="text-red-500 text-sm font-medium">{error}</p>
            }

            <Button type="submit" data-testid="register-submit" disabled={loading}>
              {loading ? es.register.registroEnProceso : es.register.registerButton}
            </Button>
          </form>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 h-[64px]">
        <Footer />
      </div>
    </Background>
  );
}