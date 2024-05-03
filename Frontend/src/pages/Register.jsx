import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const fetchData = useFetch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const register = async () => {
    const res = await fetchData(
      "/register/",
      "POST",
      { username, password, role },
      undefined
    );
    if (res.ok) {
      res.data;
      console.log(res);
    }
    toast.success("Account created successfully ;) ");
    setUsername("");
    setPassword("");
    setRole("");
    navigate("/login");
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

  const defaultTheme = createTheme();

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <Grid>
                <Grid item sm>
                  <InputLabel id="demo-simple-select-label"></InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Role"
                    style={{ height: 30 }}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {availableRoles &&
                      availableRoles.map((option) => (
                        <MenuItem value={option.role}>{option.role}</MenuItem>
                      ))}
                  </Select>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>

                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login/" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
};

export default Register;
