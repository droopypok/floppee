import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { Box, Button, Container, Grid, Input, Typography } from "@mui/material";
import UserContext from "../context/User";

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

    return `${lowestPrice} - ${highestPrice}`;
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
      <Container>
        <Grid container>
          <Grid item>
            <Grid>
              <Box>
                <Typography variant="h2">{product.productName}</Typography>
              </Box>
            </Grid>
            <Typography variant="h2">
              {cartedItems ? productPrice : getPriceRange(productItems)}
            </Typography>
            <Grid>
              <Typography variant="h5">
                Product description: {product.description}
              </Typography>
            </Grid>
            <Typography>Seller name: {product.sellerName}</Typography>
            {productItems &&
              productItems.map((item) => {
                if (item.options.length > 0)
                  return (
                    <>
                      <Button
                        onClick={() => {
                          handleSelectProductItem(
                            item.id,
                            item.price,
                            item.quantity
                          );
                        }}
                      >
                        {item.options}
                      </Button>
                    </>
                  );
              })}

            <input
              style={{ borderColor: "transparent" }}
              value={quantity}
              min={0}
              placeholder="quantity"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              type="number"
            />

            <Button onClick={addToCart}>Add to Cart</Button>
            <Typography>
              {productQuantity ? `${productQuantity} units left` : ""}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductPage;
