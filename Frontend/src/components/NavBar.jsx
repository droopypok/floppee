import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link as RRLink, useNavigate } from "react-router-dom";
import { Badge, Grid, Link } from "@mui/material";
import UserContext from "../context/User";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const NavBar = () => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                style={{
                  fontSize: "40px",
                  cursor: "pointer",
                  marginLeft: "2rem",
                }}
                color="inherit"
                underline="none"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/");
                }}
              >
                Floppee
              </Link>
            </Typography>

            <Grid
              container
              gap={5}
              alignContent={"center"}
              justifyContent={"flex-end"}
            >
              {userCtx.role === "seller" && (
                <Grid item>
                  <Button color="inherit">
                    <RRLink
                      style={{
                        color: "whitesmoke",
                        textDecoration: "none",
                        fontSize: "large",
                      }}
                      to="/sellers"
                      color="inherit"
                    >
                      sellers view
                    </RRLink>
                  </Button>
                </Grid>
              )}

              {!userCtx.accessToken ? (
                <Button color="inherit">
                  <Link href="/login" color="inherit" underline="none">
                    Login
                  </Link>
                </Button>
              ) : (
                <>
                  {userCtx.shoppingCart && (
                    <Badge
                      badgeContent={userCtx.shoppingCart.length}
                      color="warning"
                    >
                      <ShoppingCartIcon
                        style={{ cursor: "pointer", fontSize: "40" }}
                        onClick={() => navigate("/cart")}
                      ></ShoppingCartIcon>
                    </Badge>
                  )}
                </>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default NavBar;
