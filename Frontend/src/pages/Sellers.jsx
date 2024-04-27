import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";

const Sellers = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("laptop");

  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const createNewProduct = async () => {
    const res = await fetchData(
      "/create_product/",
      "POST",
      {
        name: productName,
        description: productDescription,
        category: productCategory,
        username: userCtx.username,
      },
      undefined
    );
    if (res.ok) {
      console.log("created new product!");
    }
  };

  const getAllCategories = async () => {
    const res = await fetchData("/categories/", "GET", undefined, undefined);
    if (res.ok) {
      console.log(res.data);
      setAvailableCategories(res.data.categories);
    }
    console.log(availableCategories);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewProduct();
  };

  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Create Products Input Form */}
        <Typography component="h1" variant="h5">
          Create new products
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Product Name"
                onChange={(e) => setProductName(e.target.value)}
              ></TextField>
              <TextField
                fullWidth
                required
                label="Product Description"
                onChange={(e) => setProductDescription(e.target.value)}
              ></TextField>

              <Select
                label="Category"
                value={productCategory}
                onChange={(e) => {
                  setProductCategory(e.target.value);
                }}
              >
                {availableCategories.length > 0 &&
                  availableCategories.map((item) => {
                    return (
                      <MenuItem
                        id={item.id}
                        key={item.id}
                        value={item.category}
                      >
                        {item.category}
                      </MenuItem>
                    );
                  })}
              </Select>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create new product
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Sellers;
