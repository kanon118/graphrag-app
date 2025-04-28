import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import LoginForm from "./components/LoginForm";
import UploadForm from "./components/UploadForm";
import Chat from "./components/Chat";
import GraphView from "./components/GraphView";
import axios from "axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token]);

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login misslyckades!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold">GraphRAG Chat</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logga ut
        </button>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Ladda upp dokument</h2>
        <UploadForm />
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Chatta</h2>
        <Chat />
      </div>

      <div className="col-span-1 md:col-span-2 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Graf-Visualisering</h2>
        <GraphView />
      </div>
    </div>
  );
}

export default App;
