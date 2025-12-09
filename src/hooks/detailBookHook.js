import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

export function useBookDetail(id_book) {
  
  const loggedUser = JSON.parse(localStorage.getItem("user")) || null;
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Traer detalle del libro
  const fetchBookDetail = async () => {
    try {
      const res = await axios.get(`${API_BASE}/books/detail-book/${id_book}`);
      setBook(res.data);
      setRating(res.data.rating); // rating promedio
    } catch (error) {
      console.error("Error cargando detalle del libro: ", error);
    }
  };

  // Traer reseñas del libro
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/books/book/${id_book}/reviews`);
      const data = Array.isArray(res.data.reviews) ? res.data.reviews : [];

      const formattedReviews = data.map(r => ({
        id_review: r.id_review,
        text: r.review_text,
        user: r.review_user_username,
        user_id: r.review_user_id,
        rating: r.book_rating / 2,
        date: new Date(r.creation_date).toISOString().split("T")[0],
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error("Error cargando reseñas: ", error);
      setReviews([]);
    }
  };

  // Agregar reseña
  const addReview = async () => {
    if (!reviewText || rating === 0 || !loggedUser) return;

    try {
      await axios.post(`${API_BASE}/books/book/${id_book}/review`, {
        user_id: loggedUser.id_user,
        review_text: reviewText,
        rating: rating 
      });

      setReviewText("");
      await fetchReviews();
      await fetchBookDetail();
    } catch (error) {
      console.error("Error agregando reseña: ", error);
    }
  };

  // Eliminar reseña
  const deleteReview = async (id_review) => {
    try {
      await axios.delete(`${API_BASE}/books/review/${id_review}`);
      await fetchReviews();
      await fetchBookDetail();
    } catch (error) {
      console.error("Error eliminando reseña: ", error);
    }
  };

  useEffect(() => {
    if (!id_book) return;
    setLoading(true);
    Promise.all([fetchBookDetail(), fetchReviews()]).finally(() => setLoading(false));
  }, [id_book]);


  const handleReadBook = () => {
    if (!book?.file) {
      console.error("No se ha encontrado el archivo del libro");
      return;
    }

    const ext = book.file.split(".").pop().toLowerCase();

    if (ext === "pdf") {
      window.open(book.file, "_blank");
    } else if (ext === "epub") {
      window.open(`/reader/${book.id_book}`, "_blank")
    } else {
      console.error("Formato no soportado. Solo PDF y EPUB");
    }
  };

  return {
    book,
    reviews,
    reviewText,
    setReviewText,
    rating,
    setRating,
    addReview,
    deleteReview,
    loading,
    loggedUser,
    handleReadBook
  };
}
