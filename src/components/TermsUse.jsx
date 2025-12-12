import es from "../assets/i18n/es.json";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";

export default function AvisoLegal() {
  const navigate = useNavigate();

  return (
    <Background>  
    <main className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">{es.termsUse.returnButton}</button>

      <h1 className="text-3xl font-semibold mb-4">{es.termsUse.termsUseName}</h1>

      <section className="mb-6">
        <p className="mb-2">{es.termsUse.propertyFrom} <strong>Aitor Novoa Alonso</strong>.</p>
        <p>
          {es.termsUse.contact}: <a className="text-blue-600 hover:underline" href="mailto:aitornalonso@gmail.com">aitornalonso@gmail.com</a>
        </p>
        <p className="mt-3">{es.termsUse.functionality}.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{es.termsUse.privacity}</h2>
        <p className="mb-2">{es.termsUse.privacityPhrase1}</p>
        <p className="mb-2">{es.termsUse.privacityPhrase2}</p>
        <p className="mb-2">{es.termsUse.privacityPhrase3}</p>
        <p className="mb-2">{es.termsUse.privacityPhrase4} <a className="text-blue-600 hover:underline" href="mailto:aitornalonso@gmail.com">aitornalonso@gmail.com</a>
</p>        
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{es.termsUse.cookies}</h2>
        <p className="mb-2">{es.termsUse.cookies1}</p>
        <p className="mb-2">{es.termsUse.cookies2}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{es.termsUse.intelectualProperty}</h2>
        <p className="mb-2">{es.termsUse.intelectualProperty1}</p>
        <p className="mb-2">{es.termsUse.intelectualProperty2}</p>
        <p className="mb-2">{es.termsUse.intelectualProperty3}</p>
      </section>

      <footer className="text-sm text-gray-600 mt-6">
        <p>{es.termsUse.lastUpdate} {new Date().toLocaleDateString()}</p>
      </footer>
    </main>
    </Background>
  );
}
