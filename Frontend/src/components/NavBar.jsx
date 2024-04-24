import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, SvgIcon } from "@mui/material";

const NavBar = () => {
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

            <Button color="inherit">
              <Link href="/login" color="inherit" underline="none">
                Login
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default NavBar;
