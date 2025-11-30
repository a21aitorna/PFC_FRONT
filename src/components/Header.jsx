import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useUser } from "../context/userProvider";
import logoAtenea from "../assets/images/logoAtenea.png";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
 
  const handleReturnHome = () => {
    if(!user){
      navigate("/");
      return
    }

    switch(user.id_role) {
      case 1:
        navigate("/admin-panel")
        break;
      case 2:
        navigate(`/library/${user.id_user}`);
        break;
      default: navigate("/");
      break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <header className="absolute top-0 left-0 w-full flex items-center justify-between p-4 bg-black/40 backdrop-blur-md">
      
      <div
        data-testid="returnMainPage"
        onClick={handleReturnHome}
        className="flex items-center space-x-3 text-white cursor-pointer select-none"
      >
        <div className="bg-indigo-500 rounded-xl p-2 flex items-center justify-center shadow-md h-12 w-12">
          <img
            src={logoAtenea}
            alt="Logo Atenea"
            className="h-8 w-8 object-contain filter invert brightness-0"
          />
        </div>

        <div className="flex flex-col justify-center leading-tight">
          <p className="font-gelio text-3xl">Proyecto Atenea</p>
        </div>
      </div>


      {user && (
        <div className="flex items-center gap-4">
          {/* Icono y nombre de usuario */}
          <div className="flex items-center gap-2 text-white">
            <User size={20} />
            <span className="font-medium">{user.username}</span>
          </div>

          {/* Botón logout */}
          <button
            data-testid="logoutButton"
            onClick={handleLogout}
            className="flex items-center gap-1 text-white hover:text-red-500"
          >
            <LogOut size={24} />
          </button>
        </div>
      )}
    </header>
  );
}
