import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/main" />} />
        <Route path="main" element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route path="reigster" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
