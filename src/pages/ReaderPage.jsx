import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactReader } from "react-reader";
import axios from "axios";
import { API_BASE } from "../config/api";

export default function ReaderPage() {
  const { id_book } = useParams();
  const [bookUrl, setBookUrl] = useState(null);

  useEffect(() => {
    const loadBook = async () => {
      const res = await axios.get(`${API_BASE}/books/detail-book/${id_book}`);
      setBookUrl(res.data.file);
    };
    loadBook();
  }, [id_book]);

  if (!bookUrl) return <div>Cargando libro...</div>;

  return (
    <div style={{ height: "100vh" }}>
      <ReactReader
        url={bookUrl}
        title="Lectura"
      />
    </div>
  );
}
