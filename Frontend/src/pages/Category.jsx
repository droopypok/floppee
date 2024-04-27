import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const Category = (props) => {
  const fetchData = useFetch();
  const categoryName = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);

  const getCategory = async () => {
    const res = await fetchData(
      "/categories/" + categoryName.category + "/",
      "GET",
      undefined,
      undefined
    );
    if (res.ok) {
      setCategoryProducts(res.data.products);
    }
    console.log(categoryProducts);
  };

  useEffect(() => {
    getCategory();
  }, []);
  return (
    <>
      <Container>
        <br />
        <Grid container spacing={2}>
          {categoryProducts.length > 0 &&
            categoryProducts.map((item) => {
              return (
                <Grid item sm={4} align={"center"}>
                  <Card>
                    <CardContent>
                      <CardMedia
                        component="img"
                        height="140"
                        image="https://preview.redd.it/qm3ksi2yajq41.png?auto=webp&s=6a4d6139b3edee3751d99cce315a7b568dbd595e"
                      ></CardMedia>
                      <Typography>{item.productName}</Typography>
                      <Typography>{item.description}</Typography>
                      <Typography>{item.productPrice}</Typography>
                      <Typography>{item.sellerName}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
};

export default Category;
