import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";

const Category = () => {
  const fetchData = useFetch();
  const navigate = useNavigate();
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
        <Typography variant="h3">{`Category: ${categoryName.category}`}</Typography>
        <br />
        <Grid container spacing={2}>
          {categoryProducts.length > 0 &&
            categoryProducts.map((item) => {
              return (
                <Grid item sm={4}>
                  <Card>
                    <CardActionArea
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image="https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034"
                      ></CardMedia>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Typography>{item.productPrice}</Typography>
                        <Link underline="none" color={"orangered"}>
                          {item.sellerName}
                        </Link>
                      </CardContent>
                    </CardActionArea>
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
