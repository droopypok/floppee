import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import UserContext from "./context/User.jsx";
import Sellers from "./pages/Sellers.jsx";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);

  return (
    <>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          username,
          setUsername,
          userId,
          setUserId,
          role,
          setRole,
        }}
      >
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="main" element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="sellers" element={<Sellers />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
