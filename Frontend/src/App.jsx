import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import UserContext from "./context/User.jsx";
import Sellers from "./pages/Sellers.jsx";
import Category from "./pages/Category.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import useFetch from "./hooks/useFetch.js";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(0);
  const [shoppingCart, setShoppingCart] = useState([]);

  const fetchData = useFetch();

  const getShoppingCartItems = async () => {
    const res = await fetchData(
      `/view_cart/${userId}/`,
      "GET",
      undefined,
      undefined
    );
    if (res.ok) {
      setShoppingCart(res.data.shopping_cart);
    }
  };

  useEffect(() => {
    getShoppingCartItems();
  }, [userId]);

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
          shoppingCart,
          setShoppingCart,
        }}
      >
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="main" element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="sellers" element={<Sellers />} />
          <Route path="category/:category" element={<Category />} />
          <Route path="product/:id" element={<ProductPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
