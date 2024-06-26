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
  FormGroup,
  Radio,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";
import ProductUpdateModal from "../components/ProductUpdateModal";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Sellers = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTypeSelector, setAvailableTypeSelector] = useState([]);

  // For Create New Product
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("laptop");
  const [created, setCreated] = useState(false);

  // For Create Product_Item
  const [productId, setProductId] = useState(0); // Main product Id
  const [productType, setProductType] = useState([]); // Product Type (e.g. Colour, Sizing)
  const [productOptions, setProductOptions] = useState(""); // Store option under ^^
  const [productPrice, setProductPrice] = useState(0); // for Individual product item
  const [itemQuantity, setItemQuantity] = useState(0); // for product_item quantity
  const [itemOptions, setItemOptions] = useState([]); // might be useless who knows

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [productItem, setProductItem] = useState([]);

  // For Modal
  const [selectedProduct, setSelectedProducts] = useState([]);

  const [newProduct, setNewProduct] = useState(false); // to change view

  const [sellerProducts, setSellerProducts] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
  });

  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleOpen = (id, productName, productDescription, productCategory) => {
    setSelectedProducts({
      id: id,
      name: productName,
      description: productDescription,
      category: productCategory.category,
    });
    setOpen(true);
  };

  const createMainProduct = async () => {
    const res = await fetchData(
      "/create_new_product/",
      "POST",
      {
        name: productName,
        description: productDescription,
        category: productCategory,
        id: userCtx.userId,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      toast.success(res.data.message);
      setProductId(res.data.product_id);
      getSellerProducts();
      setCreated(true);
    }
    console.log(productId);
  };

  const getAllProductSelectors = async () => {
    console.log(productCategory);
    const res = await fetchData(
      "/products_types/" + productCategory + "/",
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setAvailableTypeSelector(res.data.product_types);
    }
  };

  const getAllCategories = async () => {
    const res = await fetchData(
      "/categories/",
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setAvailableCategories(res.data.categories);
    }
  };

  const getSellerProducts = async () => {
    const res = await fetchData(
      "/products/" + userCtx.userId + "/",
      "POST",
      undefined,
      userCtx.accessToken
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
      userCtx.accessToken
    );
    if (res.ok) {
      getSellerProducts();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMainProduct();
  };

  // useEffect onLoad
  useEffect(() => {
    getAllCategories();
    getSellerProducts();
    getAllProductSelectors();
  }, []);

  useEffect(() => {
    getAllProductSelectors();
  }, [productCategory, setProductCategory]);

  useEffect(() => {
    // When availableTypeSelector is updated, set the productType to the ID of the first item
    if (availableTypeSelector.length > 0) {
      setProductType(availableTypeSelector[0].id);
      console.log(availableTypeSelector);
    }
  }, [availableTypeSelector]);

  const addOptionsToProductId = async () => {
    const res = await fetchData(
      "/create_options/",
      "PUT",
      {
        productId: productId,
        productTypeId: productType,
        option: productOptions,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      toast.success("Option added successfully");
      setProductOptions("");
      getAllProductOptions();
    }
  };

  const getAllProductOptions = async () => {
    const res = await fetchData(
      `/product_options/${productId}/`,
      "POST",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setItemOptions(res.data.productOptions);
    }
  };

  const handleSelectOptions = (e, id) => {
    const itemExistIndex = selectedOptions.findIndex(
      (item) => item.productTypeId === id
    );
    if (itemExistIndex === -1) {
      // Item doesn't exist, add it to the array
      if (selectedOptions.length < 3) {
        const tempArr = [...selectedOptions, { productTypeId: id }];
        setSelectedOptions(tempArr);
      } else {
        alert("Maximum of 3!");
      }
    } else {
      // Item already exists, remove it from the array
      const tempArr = selectedOptions.filter(
        (item) => item.productTypeId !== id
      );
      setSelectedOptions(tempArr);
    }
  };

  const handleAddItems = () => {
    const tempArr = [
      ...productItem,
      { options: selectedOptions, quantity: itemQuantity, price: productPrice },
    ];
    setProductItem(tempArr);

    setSelectedOptions([]);
    setItemQuantity(0);
    setProductPrice(0);
  };

  useEffect(() => {
    console.log(productItem);
  }, [productItem]);

  const addProductItems = async () => {
    console.log(productItem);
    const res = await fetchData(
      "/create_new_product_item/",
      "PUT",
      {
        productId: productId,
        productItems: productItem,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      toast.success("Added product items :) ");
      setProductId(0);
      setProductItem([]);
    } else {
      console.log("error");
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
                  {!created && (
                    <>
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

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Create new product
                      </Button>
                    </>
                  )}

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

                  {created && <></>}
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
                    <Button onClick={() => addOptionsToProductId()}>
                      Add Option
                    </Button>
                  </Box>

                  <br />
                  <br />

                  <Typography variant="h3">
                    Product Item #{productItem.length + 1}
                  </Typography>

                  <Grid>
                    <Grid container>
                      {availableTypeSelector.length > 0 &&
                        availableTypeSelector.map((item) => {
                          return (
                            <Grid item sm={4} textAlign={"center"}>
                              {item.option}
                              <FormControl required>
                                <FormGroup>
                                  {itemOptions.length > 0 &&
                                    itemOptions.map((option) => {
                                      if (option.productTypeId === item.id) {
                                        return (
                                          <FormControlLabel
                                            label={option.option}
                                            control={
                                              <Checkbox
                                                value={option.id}
                                                onChange={(e) => {
                                                  handleSelectOptions(
                                                    e,
                                                    option.id,
                                                    item.id
                                                  );
                                                }}
                                                name={option.option}
                                              />
                                            }
                                          >
                                            {option.option}
                                          </FormControlLabel>
                                        );
                                      }
                                    })}
                                </FormGroup>
                              </FormControl>
                            </Grid>
                          );
                        })}
                    </Grid>
                  </Grid>

                  <FormControl fullWidth sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Quantity
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">QTY</InputAdornment>
                      }
                      onChange={(e) => {
                        setItemQuantity(e.target.value);
                        console.log(itemQuantity);
                      }}
                      value={itemQuantity}
                      label="Quantity"
                    />
                  </FormControl>

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
                      value={productPrice}
                      label="Amount"
                    />
                  </FormControl>
                </Grid>
              </Grid>
              {created && (
                <>
                  <Button onClick={handleAddItems}>Add another item</Button>
                  <Button onClick={addProductItems}>Done</Button>{" "}
                </>
              )}
            </>
          </Box>
        </Box>
        <br />

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
                            onClick={() => navigate(`/product/${item.id}`)}
                          >
                            <CardMedia component="img" height="140" />
                            <Typography variant="h5">
                              {item.productName}
                            </Typography>
                            <Typography variant="h6">
                              Item Id: {item.id}
                            </Typography>
                            <Typography variant="h6" marginBottom={1}>
                              Category: {item.category}
                            </Typography>
                            <Typography variant="body1" sx={{}}>
                              {item.description}
                            </Typography>
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
        <ToastContainer />
      </Container>
    </>
  );
};

export default Sellers;
