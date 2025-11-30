import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../config/api";
import { useUser } from "../context/userProvider";

export function useAdminPanel() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //Token y axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // Obtener usuarios no admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/not-admin-users`);
        const users = res.data.map(u => ({
          id: u.id_user,
          username: u.username,
          library: u.library_name,
          is_blocked: u.is_blocked,
          block_date: u.block_date,
          is_erased: u.is_erased,
          delete_date: u.delete_date,
          status: !u.is_blocked && !u.is_erased ? "activo" : u.is_blocked ? "bloqueado" : "borrado",
        }));
        setUsers(users);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  //Bloquear usuario
  const blockUser = async (id) => {
    try {
      await axios.post(`${API_BASE}/admin/block/${id}`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, is_blocked: true, block_date: new Date().toISOString().split("T")[0]}
            : u
        )
      );
    } catch (error) {
      console.error("Error bloqueando usuario:", error);
    }
  };

  //Desbloquear usuario
  const unblockUser = async (id) => {
    try {
      await axios.post(`${API_BASE}/admin/unblock/${id}`);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, is_blocked: false, block_date: null }
            : u
        )
      );
    } catch (error) {
      console.error("Error desbloqueando usuario:", error);
    }
  };

  // Eliminar usuario
  const deleteUser = async (id) => {
    try {
      await axios.post(`${API_BASE}/admin/delete/${id}`);
      setUsers(prev =>
        prev.map(u =>
          u.id === id
            ? { ...u, is_erased: true, delete_date: new Date().toISOString().split("T")[0]}
            : u
        )
      );
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  // Rectificar borrado usuario
  const rectifyDeleteUser = async (id) => {
    try {
      await axios.post(`${API_BASE}/admin/rectify-delete/${id}`);
      setUsers(prev =>
        prev.map(u =>
          u.id === id
            ? { ...u, is_erased: false, delete_date: null }
            : u
        )
      );
    } catch (error) {
      console.error("Error rectificando usuario:", error);
    }
  };

  // Navegar a la librería del usuario
  const navigateLibraryUser = async (id_user) => {
    navigate(`/library/${id_user}`)
  };
  
  return {
    users,
    blockUser,
    unblockUser,
    deleteUser,
    rectifyDeleteUser,
    navigateLibraryUser
  };
}
