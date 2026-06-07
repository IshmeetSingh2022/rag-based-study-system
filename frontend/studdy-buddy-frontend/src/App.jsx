import { useAuthContext } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";

export default function App() {
  const { user, login, logout } = useAuthContext();

  if (!user) return <AuthPage onLogin={login} />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user.username}!
        </h1>
        <button
          onClick={logout}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}