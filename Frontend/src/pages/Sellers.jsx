import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Container,
  Card,
  CardActionArea,
  CardMedia,
  InputLabel,
  CardContent,
  CardActions,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";
import ProductUpdateModal from "../components/ProductUpdateModal";

const Sellers = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("laptop");
  const [selectedProduct, setSelectedProducts] = useState([]);

  const [sellerProducts, setSellerProducts] = useState({
    id: "",
    name: "",
    description: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = (id, productDescription, productName, productCategory) => {
    setSelectedProducts({
      id: id,
      name: productName,
      description: productDescription,
      category: productCategory,
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
        id: userCtx.userId,
      },
      undefined
    );
    if (res.ok) {
      getSellerProducts();
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

  const getSellerProducts = async () => {
    const res = await fetchData(
      "/products/" + userCtx.userId + "/",
      "POST",
      undefined,
      undefined
    );
    if (res.ok) {
      setSellerProducts(res.data.product);
    }
    console.log(sellerProducts);
  };

  const deleteProduct = async (id) => {
    const res = await fetchData(
      "/delete_product/" + id + "/",
      "DELETE",
      undefined,
      undefined
    );
    if (res.ok) {
      console.log("item deleted");
      getSellerProducts();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewProduct();
  };

  // useEffect onLoad
  useEffect(() => {
    getAllCategories();
    getSellerProducts();
  }, []);

  return (
    <>
      <Container>
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
          <Box
            component="form"
            noValidate
            sx={{ mt: 3 }}
            onSubmit={handleSubmit}
          >
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

                <InputLabel id="Category-select">Category</InputLabel>
                <Select
                  id="Category-select"
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

        {/* Seller product view */}
        <Grid container spacing={2}>
          {sellerProducts.length > 0 &&
            sellerProducts.map((item) => {
              return (
                <>
                  <Grid key={item.id} item sm={3}>
                    <Card>
                      <CardContent>
                        <CardActionArea onClick={() => console.log("Clicked")}>
                          <CardMedia component="img" height="140" />
                          <h3>{item.productName}</h3>
                          <h3>{item.description}</h3>
                          <h3>{item.id}</h3>
                          <h3>{item.category}</h3>
                        </CardActionArea>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() =>
                            handleOpen(
                              item.id,
                              item.productName,
                              item.description,
                              item.category
                            )
                          }
                        >
                          Update
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            deleteProduct(item.id);
                          }}
                        >
                          Delete Product
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </>
              );
            })}
          <ProductUpdateModal
            handleClose={handleClose}
            handleOpen={handleOpen}
            open={open}
            selectedProduct={selectedProduct}
            handleSubmit={handleSubmit}
            setProductName={setProductName}
            setProductCategory={setProductCategory}
            setProductDescription={setProductDescription}
            availableCategories={availableCategories}
          ></ProductUpdateModal>
        </Grid>
      </Container>
    </>
  );
};

export default Sellers;
