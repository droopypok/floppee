import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const fetchData = useFetch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetchData(
      "/login/",
      "POST",
      { username, password },
      undefined
    );
    if (res.ok) {
      console.log("logged in");
      console.log(res.data.access);
      console.log(res.data.refresh);
      const decoded = jwtDecode(res.data.access);
      console.log(decoded.role);
      console.log(decoded.username);
    }
    console.log(username);
    console.log(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          placeholder="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
