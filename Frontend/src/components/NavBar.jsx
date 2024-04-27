import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import UserContext from "../context/User";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const NavBar = () => {
  const userCtx = useContext(UserContext);

  console.log(userCtx);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/" color="inherit" underline="none">
                Floppee
              </Link>
            </Typography>

            {userCtx.role === "seller" && (
              <Button color="inherit">
                <Link href="/sellers" color="inherit" underline="none">
                  sellers view
                </Link>
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
