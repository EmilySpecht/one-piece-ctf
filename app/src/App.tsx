import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./screens/login/login";
import { Posts } from "./screens/posts/posts";
import { Profile } from "./screens/profile/profile";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    document.body.appendChild(
      document.createComment(
        "TODO: Remover rotas antigas usadas por Crew Marine (/pirata, /navio e /ilhas) \n GitHub repository https://github.com/EmilySpecht/one-piece-ctf",
      ),
    );
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
