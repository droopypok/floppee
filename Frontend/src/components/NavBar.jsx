import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RRLink, useNavigate } from "react-router-dom";
import { Link } from "@mui/material";
import UserContext from "../context/User";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  console.log(userCtx);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                color="inherit"
                underline="hover"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                Floppee
              </Link>
            </Typography>

            {userCtx.role === "seller" && (
              <Button color="inherit">
                <RRLink to="/sellers" color="inherit" underline="none">
                  sellers view
                </RRLink>
              </Button>
            )}

            {!userCtx.accessToken ? (
              <Button color="inherit">
                <Link href="/login" color="inherit" underline="none">
                  Login
                </Link>
              </Button>
            ) : (
              <Button color="inherit" startIcon={<ShoppingCartIcon />}>
                Cart
              </Button>
              //   <ShoppingCartIcon>
              //     <IconButton></IconButton>
              //   </ShoppingCartIcon>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default NavBar;
