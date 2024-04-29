import React, { useContext } from "react";
import UserContext from "../context/User";
import useFetch from "../hooks/useFetch";
import { Container, Typography } from "@mui/material";

const ShoppingCartPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  console.log(userCtx.shoppingCart);

  return (
    <Container>
      <Typography variant="h3">CHECK OUT PAGE</Typography>
      {userCtx.shoppingCart &&
        userCtx.shoppingCart.map((item) => {
          return (
            <>
              <p>item id: {item.id}</p>
              <p>qty: {item.quantity}</p>
              <p></p>
            </>
          );
        })}
    </Container>
  );
};

export default ShoppingCartPage;
