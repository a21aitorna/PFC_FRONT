import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TermsUse from "./pages/TermsUse";
import Register from "./pages/Register";
import RecoverPasswordPageOne from "./pages/RecoverPasswordPageOne";
import RecoverPasswordPageTwo from "./pages/RecoverPasswordPageTwo";
import Library from "./pages/Library";
import AdminPanel from "./pages/AdminPanel";
import BookDetail from "./pages/BookDetail";
import ReaderPage from "./pages/ReaderPage"
import { UserProvider } from "./context/userProvider"; 
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>

          <Route element={<PublicRoute />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms-of-use" element={<TermsUse />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover-password-verify-user" element={<RecoverPasswordPageOne />} />
            <Route path="/recover-password-enter-new-password" element={<RecoverPasswordPageTwo />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/library/:userId" element={<Library />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/book/:id_book" element={<BookDetail />} />
            <Route path="/reader/:id_book" element={<ReaderPage />} /> 
          </Route>

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
