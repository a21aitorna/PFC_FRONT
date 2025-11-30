import { useState } from "react";
import { ReactReader } from "react-reader";

export default function EpubReader({ url, onClose }) {
  const [location, setLocation] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cerrar
        </button>

        {/* ReactReader */}
        <ReactReader
          url={url}
          title="Mi libro"
          location={location}
          locationChanged={setLocation}
          epubOptions={{ spread: "always" }}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
