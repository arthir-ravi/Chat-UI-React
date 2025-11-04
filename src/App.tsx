import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/login";
import Register from "./screens/register";
import ChatLayout from "./chat-screens/ChatLayout";
import { messaging, requestFCMToken } from "./firebase/firebase";
import { onMessage } from "firebase/messaging";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));

  useEffect(() => {
    requestFCMToken();
    onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      if (payload.notification) {
        new Notification(payload.notification.title || "New Message", {
          body: payload.notification.body,
        });
      }
    });
  }, []);

  const handleLogin = (newToken: string, newUserId: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    setToken(newToken);
    setUserId(newUserId);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/chat" : "/login"} replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={ token ? ( <ChatLayout userId={userId!} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )}
        />
      </Routes>
    </Router>
  );
};

export default App;
