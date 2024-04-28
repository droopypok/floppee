import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography } from "@mui/material";

const ProductPage = () => {
  const fetchData = useFetch();
  const productId = useParams();
  const [product, setProduct] = useState([]);
  const [productItems, setProductItems] = useState([]);

  const getProductById = async () => {
    console.log(productId);
    const res = await fetchData(
      `/productId/${productId.id}/`,
      "GET",
      undefined,
      undefined
    );
    console.log(res);
    setProduct(res.data.product);
  };
  console.log(product);

  const getProductItem = async () => {
    const res = await fetchData(
      `/product_items/${productId.id}/`,
      "GET",
      undefined,
      undefined
    );
    if (res.ok) {
      console.log(res.data);
      setProductItems(res.data.product);
    } else {
      console.log("There is an error");
    }
  };

  useEffect(() => {
    getProductById();
    getProductItem();
  }, []);
  return (
    <>
      <Container>
        <Grid container>
          <Grid item></Grid>
          <Grid item>
            <Typography>Product name: {product.productName}</Typography>
            <Typography>Product description: {product.description}</Typography>
            <Typography>Seller name: {product.sellerName}</Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductPage;
