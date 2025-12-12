import es from "../assets/i18n/es.json";
import { Link } from "react-router-dom";


export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full flex justify-between items-center text-white text-sm py-4 px-6">
      <span>© 2025 Proyecto Atenea. Todos los derechos reservados.</span>
      <Link
        to="/terms-of-use"
        className="text-blue-300 hover:underline whitespace-nowrap"
      >
        {es.termsUse.termsUseName}
      </Link>
    </footer>
  );
}
