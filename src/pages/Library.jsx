import { Search, Plus, Star, Download, Trash2, Home } from "lucide-react";
import es from "../assets/i18n/es.json";
import { useParams } from "react-router-dom";
import { useLibrary } from "../hooks/libraryHook";
import { useUser } from "../context/userProvider";
import { useState, useRef } from "react";

import Background from "../components/Background";
import Header from "../components/Header";
import InputText from "../components/InputText";
import PanelCard from "../components/PanelCard";
import StarRating from "../components/StarRating";

export default function Library() {
  const { userId } = useParams();
  const {
    filteredBooks,
    search,
    setSearch,
    loading,
    sortOption,
    setSortOption,
    sortOrder,
    setSortOrder,
    libraryName,
    uploadBook,
    userQuery,
    setUserQuery,
    userResults,
    deleteBook,
    downloadBook,
    isOwner,
    isAdmin,
    goBackToMainPage,
    selectLibrary,
    errorBooks, 
    errorUserSearch,
    navigateDetailBook
  } = useLibrary(userId); 

  const { user, logout } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;

  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const fileInputRef = useRef(null);
  const handleAddBookClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadBook(file);
    if (result.error) alert(result.error);
    else alert(es.library.uploadedBook.replace("{{title}}", result.book.title));
  };

  const handleDelete = async (book) => {
    const ok = window.confirm(es.library.confirmDelete);
    if (!ok) return;

    const result = await deleteBook(book.id_book, book.user_id);
    if (result.error) {
      alert(result.error);
      return;
    }

    // Actualizar página si la actual queda vacía
    const newTotalPages = Math.ceil((filteredBooks.length - 1) / booksPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1); // si no hay páginas, ir a 1
    }

    alert(es.library.correctDelete);
  };

  return (
    <Background>
      {/* Header fijo */}
      <div className="fixed top-0 left-0 w-full z-50 h-16">
        <Header user={user} logout={logout} />
      </div>


      {/* Contenedor principal */}
      <div className="mt-20 mb-16 w-full max-w-7xl mx-auto px-6 flex flex-col space-y-6">
        {!isOwner && (
          <button
            className="mb-4 inline-flex items-center gap-1 text-indigo-600 bg-white border border-indigo-600 px-2 py-1 rounded transition text-sm w-fit hover:text-white hover:bg-indigo-600"
            data-testid="returnToLibraryButton"
            onClick={goBackToMainPage}
          >
            <Home size={14} /> {isAdmin? es.library.returnPanelAdmin : es.library.returnLibrary}
          </button>
        )}

        {/* Panel Buscar usuarios/librerías */}
        <PanelCard title={es.library.searchUserLibraryTitle} className="w-full text-left">
          <div className="relative mt-4">
            <InputText
              data-testid="searchUsersLibraries"
              placeholder={es.library.searchUserLibraryTitle}
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          {errorUserSearch && (
            <p data-testid="errorSearchingLibraries" className="text-red-500 text-sm mb-2">{errorUserSearch}</p>
          )}

          {/* Resultados */}
          {userResults.length > 0 && (
            <div className="mt-4 bg-gray-50 rounded-xl shadow-inner p-3 space-y-2">
              {userResults.map((u) => (
                <div
                  data-testid={`selectLibrary-${user.id_user}`}
                  key={u.id}
                  className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-200 cursor-pointer transition"
                  onClick={() => selectLibrary(u.id)}
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-800">{u.username}</p>
                    <p className="text-sm text-gray-500">{u.libraryName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {userQuery.length > 2 && userResults.length === 0 && (
            <p data-testid="notUsersLibrariesMatch" className="text-sm text-gray-500 mt-4">{es.library.searchUserLibraryNotFound}</p>
          )}
        </PanelCard>

        {/* Área principal: sidebar + librería */}
        <div className="flex flex-col md:flex-row w-full space-y-6 md:space-y-0 md:space-x-6">
          
          {/* Sidebar */}
          <aside className="md:w-1/4 space-y-6 flex-shrink-0">
            {/* Panel Buscar libros */}
            <PanelCard>
              <p className="text-sm font-medium text-gray-700 mb-2">{es.library.searchBooks}</p>
              <div className="relative">
                <InputText
                  data-testid="searchBooksLibrary"
                  placeholder={es.library.searchBooksPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </PanelCard>

            {/* Panel Ordenar libros */}
            <PanelCard>
              <p className="text-sm font-medium text-gray-700 mb-2">{es.library.orderBy}</p>
              <select
                data-testid="selectSortOptionLibrary"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 mt-1 text-sm"
              >
                <option value="">{es.library.select}</option>
                <option value="date">Fecha</option>
                <option value="rating">Puntuación</option>
              </select>

              {sortOption && (
                <select
                  data-testid="selectOrderSortLibrary"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1 mt-2 text-sm"
                >
                  <option data-testid="ascendingOrder" value="asc">{es.library.ascOrder}</option>
                  <option data-testid="descendingOrder" value="desc">{es.library.descOrder}</option>
                </select>
              )}
            </PanelCard>
          </aside>

          {/* Contenedor principal */}
          <PanelCard className="flex-1 flex flex-col max-h-[calc(100vh-8rem)]">
            {/* Encabezado: Mi Librería + Añadir libro */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                <span data-testid="usersLibraryName">
                  {libraryName || `${es.library.defaultLibraryName}`}
                </span>
                <span className="text-sm text-gray-500">
                  ({filteredBooks.length} {es.library.numberBooks})
                </span>
              </h2>


              {isOwner && (
                <button
                  data-testid="uploadBookLibrary"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
                  onClick={handleAddBookClick}
                >
                  <Plus size={16} /> {es.library.addBookButton}
                </button>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf,.epub"
              />
            </div>

            {errorBooks && (
              <p data-testid="errorBooksLibrary" className="text-red-500 text-sm mb-2">{errorBooks}</p>
            )}

            {/* Grid de libros o carga */}
            {loading ? (
              <p className="text-center text-gray-500 mt-10">{es.library.loadingBooks}</p>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentBooks.map((book, index) => (
                      <div
                        key={index}
                        className="rounded-xl shadow-md p-4 bg-white/60 backdrop-blur-sm border border-white/20 flex space-x-4 items-start"
                        onClick={() => navigateDetailBook(book.id_book)}
                        data-testid={`book${book.id_book}`}
                      >
                        {book.cover && (
                          <img
                            data-testid={`titleBook-${book.id_book}`}
                            src={book.cover}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                          />
                        )}

                        <div className="flex-1 text-sm text-gray-800">
                          <h3 data-testid={`titleBook-${book.id_book}`} className="font-semibold">{book.title}</h3>
                          <p data-testid={`authorBook-${book.id_book}`} className="text-gray-600">{book.author}</p>

                          {/* Rating */}
                          <div data-testid={`ratingBook-${book.id_book}`} className="flex items-center space-x-1 text-yellow-500">
                            <StarRating rating={book.rating/2} readonly size={14} />
                          </div>

                          <div className="flex items-center gap-4 mt-2">
                            <button
                              data-testid = "downloadBookButton"
                              className="flex items-center justify-center p-1 rounded-lg hover:bg-gray-200"
                              title={es.library.downloadButtonTitle}
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadBook(book.id_book);
                              }}
                            >
                              <Download size={18} />
                            </button>

                            {(isOwner || isAdmin) && (
                              <button
                                data-testid = "deleteBookButton"
                                className="flex items-center justify-center p-1 rounded-lg hover:bg-gray-200"
                                title={es.library.deleteButtonTitle}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(book);
                                }}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                            {/* hacer fetchFecha */}
                          <p className="text-gray-400 text-xs">
                            {book.upload_date?.split("T")[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        data-testid={`paginationButton-${i+1}`}
                        key={i}
                        className={`px-3 py-1 rounded-lg border ${
                          currentPage === i + 1
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </PanelCard>
        </div>
      </div>
    </Background>
  );
}
