import React, { useState } from "react";
import useFetch from "../hooks/useFetch";

const Register = () => {
  const fetchData = useFetch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const register = async () => {
    const res = await fetchData(
      "/register",
      "POST",
      { username, password, role },
      undefined
    );
    if (res.ok) {
      console.log("logged in");
      console.log(res.data.access);
      console.log(res.data.refresh);
    }
    console.log(username);
    console.log(password);
    console.log(role);
    setUsername("");
    setPassword("");
    setRole("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };
  return (
    <>
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
        <input
          placeholder="role"
          type="text"
          onChange={(e) => setRole(e.target.value)}
        ></input>
        <button>Register</button>
      </form>
    </>
  );
};

export default Register;
