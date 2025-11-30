import { useAdminPanel } from "../hooks/adminPanelHook";
import Background from "../components/Background";
import Header from "../components/Header";
import PanelCard from "../components/PanelCard";
import es from "../assets/i18n/es.json";

export default function AdminPanel() {
  const {
    users,
    blockUser,
    unblockUser,
    deleteUser,
    rectifyDeleteUser,
    navigateLibraryUser
  } = useAdminPanel();

  return (
    <Background>
      <div className="fixed top-0 left-0 w-full z-50 h-16">
        <Header />
      </div>

      <PanelCard className="mt-24 w-[95%] md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
        <h1 className="text-2xl font-bold mb-6">{es.adminPanel.titlePaged}</h1>

        <div className="overflow-x-auto border rounded-lg shadow max-h-[500px] overflow-y-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">{es.adminPanel.columnUser}</th>
                <th className="p-3 text-left">{es.adminPanel.columnUser}</th>
                <th className="p-3 text-left">{es.adminPanel.columnStatus}</th>
                <th className="p-3 text-left">{es.adminPanel.columnActions}</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 break-words">{user.username}</td>
                  <td className="p-3 break-words">
                    <span className="cursor-pointer" onClick={() => navigateLibraryUser(user.id)}>
                      {user.library}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="p-3">
                    {user.is_erased ? (
                      <div className="px-2 py-1 bg-gray-500 text-white rounded-full text-sm w-max">
                        {es.adminPanel.deletedStatus}
                        {user.delete_date && (
                          <span className="text-black text-xs block">
                            {`${es.adminPanel.date}${new Date(user.delete_date).toISOString().split("T")[0]}`}
                          </span>
                        )}
                      </div>
                    ) : user.is_blocked ? (
                      <div className="px-2 py-1 bg-red-500 text-white rounded-full text-sm w-max">
                        {es.adminPanel.blockedStatus}
                        {user.block_date && (
                          <span className="text-black text-xs block">
                            {`${es.adminPanel.date}${new Date(user.block_date).toISOString().split("T")[0]}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-green-500 text-white rounded-full text-sm">
                        {es.adminPanel.activeStatus}
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="p-3 flex gap-2 flex-wrap">
                    {user.is_erased ? (
                      <button
                        data-testid="rectifyDeleteButton"
                        className="px-3 py-1 bg-green-200 rounded whitespace-nowrap"
                        onClick={() => rectifyDeleteUser(user.id)}
                      >
                        {es.adminPanel.rectifyButton}
                      </button>
                    ) : user.is_blocked ? (
                      <>
                        <button
                          data-testid="rectifyBlockButton"
                          className="px-3 py-1 bg-green-200 rounded whitespace-nowrap"
                          onClick={() => unblockUser(user.id)}
                        >
                          {es.adminPanel.rectifyButton}
                        </button>
                        <button
                          data-testid="deleteButton2"
                          className="px-3 py-1 bg-red-500 text-white rounded whitespace-nowrap"
                          onClick={() => deleteUser(user.id)}
                        >
                          {es.adminPanel.deleteButton}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          data-testid="blockButton"
                          className="px-3 py-1 bg-yellow-200 rounded whitespace-nowrap"
                          onClick={() => blockUser(user.id)}
                        >
                          {es.adminPanel.blockButton}
                        </button>
                        <button
                          data-testid="deleteButton1"
                          className="px-3 py-1 bg-red-500 text-white rounded whitespace-nowrap"
                          onClick={() => deleteUser(user.id)}
                        >
                          {es.adminPanel.deleteButton}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </Background>
  );
}
