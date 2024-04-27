import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";

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
      {categoryProducts.length > 0 &&
        categoryProducts.map((item) => {
          return (
            <Card>
              <CardContent>
                <Typography>{item.productName}</Typography>
                <Typography>{item.description}</Typography>
                <Typography>{item.productPrice}</Typography>
              </CardContent>
            </Card>
          );
        })}
    </>
  );
};

export default Category;
