import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Grid, Input, Typography } from "@mui/material";
import UserContext from "../context/User";
import formatCost from "../components/CostFormatter";

const ProductPage = () => {
  const fetchData = useFetch();
  const productId = useParams();
  const userCtx = useContext(UserContext);

  const [product, setProduct] = useState([]);
  const [productItems, setProductItems] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [cartedItems, setCartedItems] = useState(0);

  const [productPrice, setProducePrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);

  const [selectProductItem, setSelectProductItem] = useState("");

  const getProductById = async () => {
    console.log(productId);
    const res = await fetchData(
      `/productId/${productId.id}/`,
      "GET",
      undefined,
      undefined
    );
    setProduct(res.data.product);
  };

  const getProductItem = async () => {
    const res = await fetchData(
      `/product_items/${productId.id}/`,
      "GET",
      undefined,
      undefined
    );
    if (res.ok) {
      setProductItems(res.data.product_items);
    } else {
      console.log("There is an error");
    }
  };

  const addToCart = async () => {
    const res = await fetchData(
      "/add_to_cart/",
      "POST",
      {
        userId: userCtx.userId,
        productId: cartedItems,
        quantity: quantity,
      },
      undefined
    );
    if (res.ok) {
      getShoppingCartItems();
    }
  };

  const getShoppingCartItems = async () => {
    const res = await fetchData(
      `/view_cart/${userCtx.userId}/`,
      "GET",
      undefined,
      undefined
    );
    if (res.ok) {
      userCtx.setShoppingCart(res.data.shopping_cart);
    }
  };

  const getPriceRange = (products) => {
    const pricedProducts = products.filter((product) => product.price > 0);
    pricedProducts.sort((a, b) => a.price - b.price);

    if (pricedProducts.length === 0) {
      return "N/A";
    }

    const lowestPrice = pricedProducts[0].price;
    const highestPrice = pricedProducts[pricedProducts.length - 1].price;

    return `$${formatCost(lowestPrice)} - $${formatCost(highestPrice)}`;
  };

  useEffect(() => {
    getProductById();
    getProductItem();
  }, []);

  const handleSelectProductItem = (id, price, quantity) => {
    setProducePrice(price);
    setCartedItems(id);
    setProductQuantity(quantity);
  };

  useEffect(() => {
    console.log(cartedItems);
    console.log(productPrice);
    console.log(productQuantity);
  }, [cartedItems]);

  return (
    <>
      <Grid>
        <Grid container marginTop={10}>
          <Grid xs={12} marginBottom={10}>
            <Typography align="center" variant="h1">
              {product.productName}
            </Typography>
          </Grid>

          <Grid
            xs={12}
            marginBottom={10}
            paddingLeft={15}
            paddingRight={15}
            paddingTop={5}
            paddingBottom={5}
            boxShadow={1}
            textAlign={"justify"}
            bgcolor={"white"}
          >
            <Typography align="center" variant="h3" color="text.secondary">
              {product.description}
            </Typography>
          </Grid>

          <Grid xs={12} align="center" marginBottom={5}>
            <Typography variant="h3">
              {cartedItems
                ? formatCost(productPrice)
                : getPriceRange(productItems)}
            </Typography>
          </Grid>

          {selectProductItem && (
            <Grid
              xs={12}
              align="center"
              marginBottom={3}
              sx={{ width: "auto" }}
              paddingTop={5}
              paddingBottom={5}
            >
              <Typography variant="h4" marginBottom={2}>
                {selectProductItem.join(" ")}
              </Typography>
              <Typography variant="h5" color={"GrayText"}>
                {productQuantity ? `${productQuantity} units left` : ""}
              </Typography>
            </Grid>
          )}

          <Grid xs={12} align="center">
            {productItems &&
              productItems.map((item) => {
                if (item.options.length > 0)
                  return (
                    <>
                      <Button
                        xs={2}
                        sx={{ fontSize: 20, color: "orangered" }}
                        onClick={() => {
                          handleSelectProductItem(
                            item.id,
                            item.price,
                            item.quantity
                          );
                          setSelectProductItem(item.options);
                        }}
                      >
                        {item.options.length > 1
                          ? item.options.join(" ")
                          : item.options}
                      </Button>
                    </>
                  );
              })}
          </Grid>
          <Typography>{product.sellerName}</Typography>

          <Grid
            xs={12}
            align="center"
            paddingBottom={10}
            display={"flex"}
            justifyContent={"center"}
          >
            <input
              style={{
                borderColor: "transparent",
                marginTop: "20px",
                fontSize: "30px",
                textAlign: "center",
                width: "200px",
              }}
              value={quantity}
              min={0}
              placeholder="quantity"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              type="number"
            />
            <Button
              sx={{ fontSize: 20, marginLeft: 15, height: 1 }}
              onClick={addToCart}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductPage;
