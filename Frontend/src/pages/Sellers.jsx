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
  Input,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  OutlinedInput,
  FormControl,
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

  const [availableTypeSelector, setAvailableTypeSelector] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([]);

  const [productType, setProductType] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productPrice, setProductPrice] = useState(0);
  const [productSelections, setProductSelections] = useState([]);

  const [selectedProduct, setSelectedProducts] = useState([]);

  const [newProduct, setNewProduct] = useState(false);

  const [sellerProducts, setSellerProducts] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = (id, productName, productDescription, productCategory) => {
    setSelectedProducts({
      id: id,
      name: productName,
      description: productDescription,
      category: productCategory.category,
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
        productPrice: productPrice,
        productTypes: productSelections,
      },
      undefined
    );
    if (res.ok) {
      getSellerProducts();
      setNewProduct(true);
      console.log("created new product!");
    }
  };

  const getAllProductSelectors = async () => {
    console.log(productCategory);
    const res = await fetchData(
      "/products_types/" + productCategory + "/",
      "GET",
      undefined,
      undefined
    );

    if (res.ok) {
      setAvailableTypeSelector(res.data.product_types);
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
    getAllProductSelectors();
  }, []);

  useEffect(() => {
    getAllProductSelectors();
    setProductSelections([]);
  }, [productCategory, setProductCategory]);

  useEffect(() => {
    // When availableTypeSelector is updated, set the productType to the ID of the first item
    if (availableTypeSelector.length > 0) {
      setProductType(availableTypeSelector[0].id);
      console.log(availableTypeSelector);
    }
  }, [availableTypeSelector]);

  const addOptionsToId = (e) => {
    if (!productType) return;

    const idExists = productSelections.findIndex((item) => {
      return item.type === productType;
    });

    const optionExists = productSelections.some((item) =>
      item.options.includes(productOptions)
    );

    if (optionExists) {
      console.log("already inside bitch");
      return;
    }

    if (productOptions !== "") {
      if (idExists === -1) {
        setProductSelections([
          ...productSelections,
          { type: productType, options: [productOptions] },
        ]);
      } else {
        const updatedProductSelections = [...productSelections];
        updatedProductSelections[idExists].options.push(productOptions);
        setProductSelections(updatedProductSelections);
      }
      setProductOptions("");
    }
  };

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
            <>
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
                    multiline
                    label="Product Description"
                    onChange={(e) => setProductDescription(e.target.value)}
                  ></TextField>

                  <InputLabel id="Category-select">
                    Category
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
                  </InputLabel>

                  <InputLabel id="item-type-selector">
                    Item Types
                    <Select
                      id="item-type-selector"
                      label="Item Types"
                      placeholder="Select Type"
                      value={productType}
                      onChange={(e) => {
                        setProductType(e.target.value);
                      }}
                    >
                      {availableTypeSelector.length > 0 &&
                        availableTypeSelector.map((item) => {
                          return (
                            <MenuItem
                              id={item.id}
                              key={item.id}
                              value={item.id}
                            >
                              {item.option}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </InputLabel>

                  <Box mt={2}>
                    <InputLabel htmlFor="custom-input">
                      Add Options for Item Types
                    </InputLabel>
                    <Input
                      id="custom-input"
                      type="text"
                      value={productOptions}
                      onChange={(e) => {
                        setProductOptions(e.target.value);
                      }}
                    />
                    <Button onClick={() => addOptionsToId()}>Add Option</Button>
                  </Box>

                  <Box container>
                    {productSelections.length > 0 &&
                      productSelections.map((item) => {
                        const type = availableTypeSelector.find(
                          (type) => type.id === item.type
                        );

                        const typeName = type ? type.option : "";

                        return (
                          <>
                            <Typography item variant="h5">
                              {typeName}
                            </Typography>
                            {item.options.map((options) => {
                              return (
                                <Typography item variant="h6">
                                  {options}
                                </Typography>
                              );
                            })}
                          </>
                        );
                      })}
                  </Box>

                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Amount
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      onChange={(e) => {
                        setProductPrice(e.target.value);
                        console.log(productPrice);
                      }}
                      label="Amount"
                    />
                  </FormControl>

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
            </>
          </Box>
        </Box>

        {/* Seller product view */}
        <Grid container spacing={2}>
          {sellerProducts.length > 0 &&
            sellerProducts
              .map((item) => {
                return (
                  <>
                    <Grid key={item.id} item sm={3}>
                      <Card>
                        <CardContent>
                          <CardActionArea
                            onClick={() => console.log("Clicked")}
                          >
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
              })
              .reverse()}
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
            getSellerProducts={getSellerProducts}
          ></ProductUpdateModal>
        </Grid>
      </Container>
    </>
  );
};

export default Sellers;
