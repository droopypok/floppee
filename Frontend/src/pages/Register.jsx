import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

const Register = () => {
  const fetchData = useFetch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const register = async () => {
    const res = await fetchData(
      "/register/",
      "POST",
      { username, password, role },
      undefined
    );
    if (res.ok) {
      res.data;
    }
    console.log(username);
    console.log(password);
    console.log(role);
    setUsername("");
    setPassword("");
    setRole("");
  };

  const getRoles = async () => {
    const res = await fetchData("/roles/", "GET", undefined, undefined);
    if (res.ok) {
      console.log(res.data);
      setAvailableRoles(res.data.roles);
      setLoading(false); // Update loading state once data is fetched
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        {loading ? (
          <p>Loading....</p>
        ) : (
          <select
            value={role} // Set the selected value to the state 'role'
            onChange={(e) => setRole(e.target.value)}
          >
            {availableRoles.map(
              (option) =>
                option.role !== "admin" && (
                  <option key={option.role} value={option.role}>
                    {option.role}
                  </option>
                )
            )}
          </select>
        )}
        <button>Register</button>
      </form>
    </>
  );
};

export default Register;
