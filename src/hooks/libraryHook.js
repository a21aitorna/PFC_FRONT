import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";
import { useUser } from "../context/userProvider";
import es from "../assets/i18n/es.json";

export function useLibrary(routeUserId) {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();

  const parsedRouteUserId = routeUserId ? Number(routeUserId) : null;
  const userId = parsedRouteUserId || user?.id_user;
  const isOwner = user?.id_user === userId;
  const isAdmin = user?.id_role === 1;

  const goToUserLibrary = (id) => navigate(`/library/${id}`);

  const [libraryName, setLibraryName] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [loadingUserSearch, setLoadingUserSearch] = useState(false);

  const [errorBooks, setErrorBooks] = useState("");
  const [errorUserSearch, setErrorUserSearch] = useState("");

  const ALLOWED_EXTENSIONS = ["pdf", "epub"];

  // Buscar usuarios/librerías
  useEffect(() => {
    if (userQuery.trim() === "") {
      setUserResults([]);
      setErrorUserSearch("");
      return;
    }

    const delay = setTimeout(async () => {
      setLoadingUserSearch(true);
      setErrorUserSearch("");
      try {
        const res = await axios.get(
          `${API_BASE}/users/search?q=${encodeURIComponent(userQuery)}`
        );
        
        const filteredResults = res.data.filter(u => u.id !== user?.id_user);

        setUserResults(filteredResults );
      } catch {
        setErrorUserSearch(es.library.errorWhileSearchingUsers);
      } finally {
        setLoadingUserSearch(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [userQuery, user?.id_user]);

  // Fetch nombre librería
  const fetchLibraryName = async (idParam) => {
    const idToFetch = idParam || user?.id_user;
    if (!idToFetch) return;

    setErrorBooks("");
    try {
      const res = await axios.get(
        `${API_BASE}/library-name?id_user=${idToFetch}`
      );
      setLibraryName(res.data?.library_name || es.library.unknownLibrary);
    } catch {
      setErrorBooks(es.library.errorWhileFetchingLibraryName);
      setLibraryName(es.library.unknownLibrary);
    }
  };

  // Fetch libros
  const fetchBooks = async () => {
    if (!userId) {
      setBooks([]);
      setFilteredBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorBooks("");
    try {
      const res = await axios.get(`${API_BASE}/books/user/${userId}`);
      // Aseguramos que cada book tenga user_id del dueño
      const booksWithOwner = res.data.map((b) => ({
        ...b,
        user_id: b.user_id ?? userId,
      }));
      setBooks(booksWithOwner);
      setFilteredBooks(booksWithOwner);
    } catch {
      setErrorBooks(es.library.errorWhileLoadingBooks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && userId) {
      fetchLibraryName(userId);
      fetchBooks();
      setSearch("");
    }
  }, [userId, userLoading]);

  // Filtrado y ordenamiento
  useEffect(() => {
    let filtered = [...books];

    if (search) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOption) {
      filtered.sort((a, b) => {
        if (sortOption === "date") {
          return sortOrder === "asc"
            ? new Date(a.upload_date) - new Date(b.upload_date)
            : new Date(b.upload_date) - new Date(a.upload_date);
        } else if (sortOption === "rating") {
          return sortOrder === "asc"
            ? (a.rating || 0) - (b.rating || 0)
            : (b.rating || 0) - (a.rating || 0);
        }
        return 0;
      });
    }

    setFilteredBooks(filtered);
  }, [books, search, sortOption, sortOrder]);

  // Archivos permitidos
  const allowedFile = (filename) => {
    if (!filename || typeof filename !== "string") return false;
    const ext = filename.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  // Subir libro
  const uploadBook = async (file) => {
    if (!isOwner) return { error: es.library.canNotUploadForeignLibraies };
    if (!file) return { error: es.library.fileNotSelected };
    if (!user?.id_user) return { error: es.library.notLoggedUser };
    if (!allowedFile(file.name)) return { error: es.library.formatNotAllowed };

    setErrorBooks("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id_user);

    try {
      const res = await axios.post(`${API_BASE}/books/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = res.data.book;

      let normalizedCover = null;
      if (uploaded.cover) {
        const coverFileName = uploaded.cover.split("/").pop();
        normalizedCover = `${API_BASE}/books/cover/${coverFileName}`;
      }

      const normalizedBook = {
        ...uploaded,
        cover: normalizedCover,
        upload_date: new Date(uploaded.uploaded_date).toISOString().split("T")[0],
        user_id: user.id_user, // dueño del libro
      };

      setBooks((prev) => [normalizedBook, ...prev]);
      setFilteredBooks((prev) => [normalizedBook, ...prev]);

      return { success: true, book: normalizedBook };
    } catch (err) {
      const msg = err.response?.data?.error || es.library.errorWhileUploadingBook;
      setErrorBooks(msg);
      return { error: msg };
    }
  };

  // Borrar libro
  const deleteBook = async (bookId, ownerId) => {
    if (!isOwner && !isAdmin) return { error: es.library.canNotDeleteBookForeignLibraries };
    if (!user?.id_user) return { error: es.library.notLoggedUser };

    setErrorBooks("");
    try {
      const res = await axios.delete(`${API_BASE}/books/delete/user/${ownerId}/book/${bookId}`);
      if (res.status === 200 || res.data.message === "Libro eliminado correctamente") {
        // Actualizar estados
        setBooks((prev) => prev.filter((b) => b.id_book !== bookId));
        setFilteredBooks((prev) => prev.filter((b) => b.id_book !== bookId));
        return { success: true };
      }
      const msg = res.data?.msg || es.library.errorWhileDeletingBook;
      setErrorBooks(msg);
      return { error: msg };
    } catch {
      const msg = es.library.errorWhileDeletingBook;
      setErrorBooks(msg);
      return { error: msg };
    }
  };

  // Descargar libro
  const downloadBook = (bookId) => {
    if (!bookId) return;
    window.open(`${API_BASE}/books/download/${bookId}`, "_blank");
  };

  //Regresar a la librería en caso de rol usuario, panel en caso de admin
  const goBackToMainPage = () => {
    if (!user?.id_user) return;
    setUserQuery("");
    setSearch("");
    
    if (isAdmin){
      navigate("/admin-panel")
    }
    else {
      navigate(`/library/${user.id_user}`)
    }
  };

  // Seleccionar librería
  const selectLibrary = (id) => {
    setUserQuery("");
    setUserResults([]);
    goToUserLibrary(id);
  };

  const navigateDetailBook = (idBook) => {
    navigate(`/book/${idBook}`, { state: { userId } });
  };

  return {
    books,
    filteredBooks,
    loading,
    search,
    setSearch,
    sortOption,
    setSortOption,
    sortOrder,
    setSortOrder,
    libraryName,
    uploadBook,
    fetchBooks,
    userQuery,
    setUserQuery,
    userResults,
    loadingUserSearch,
    goToUserLibrary,
    deleteBook,
    downloadBook,
    isOwner,
    isAdmin,
    goBackToMainPage,
    selectLibrary,
    errorBooks,
    errorUserSearch,
    navigateDetailBook
  };
}
