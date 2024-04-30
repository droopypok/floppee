import React, { useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";
import { Container, Grid } from "@mui/material";

const CheckOut = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  return (
    <Container>
      <Grid>This is the checkout page</Grid>
    </Container>
  );
};

export default CheckOut;
