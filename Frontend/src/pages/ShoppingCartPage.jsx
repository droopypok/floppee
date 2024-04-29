import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/User";
import useFetch from "../hooks/useFetch";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

const ShoppingCartPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [groupedItems, setGroupedItems] = useState([]);

  // reduce to find all the same id and push them to same array
  const groupItems = () => {
    const sortedShoppingCart = [...userCtx.shoppingCart].sort((a, b) => {
      // Sort by productId first
      if (a.productId !== b.productId) {
        return a.productId - b.productId;
      }
      // If productId is the same, sort by productItemId
      return a.productItemId - b.productItemId;
    });

    console.log(sortedShoppingCart);

    const grouped = sortedShoppingCart.reduce((acc, item) => {
      const existingGroupIndex = acc.findIndex(
        (group) => group.productId === item.productId
      );
      if (existingGroupIndex !== -1) {
        acc[existingGroupIndex].items.push(item);
      } else {
        acc.push({ productId: item.productId, items: [item] });
      }
      return acc;
    }, []);

    setGroupedItems(grouped);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    groupedItems.forEach((product) => {
      product.items.forEach((item) => {
        if (item.selected) {
          total += item.price * item.quantity;
        }
      });
    });
    return total;
  };

  const toggleSelected = (productId, itemId) => {
    setGroupedItems((prevGroupedItems) => {
      const updatedGroupedItems = prevGroupedItems.map((product) => {
        if (product.productId === productId) {
          return {
            ...product,
            items: product.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, selected: !item.selected };
              }
              return item;
            }),
          };
        }
        return product;
      });
      return updatedGroupedItems;
    });
  };

  useEffect(() => {
    if (userCtx.userId) {
      groupItems();
    }
    console.log(groupedItems);
  }, [userCtx.shoppingCart]);

  const addToCart = async (productId, quantity) => {
    const res = await fetchData(
      "/add_to_cart/",
      "POST",
      {
        userId: userCtx.userId,
        productId: productId,
        adjustQuantity: quantity,
      },
      undefined
    );
    if (res.ok) {
      console.log(res.data);
      getShoppingCartItems();
    }
  };

  const removeFromCart = async (id) => {
    const res = await fetchData(
      `/remove_from_cart/${id}/`,
      "DELETE",
      undefined,
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

  return (
    <Container>
      <Typography variant="h3">CART PAGE</Typography>
      {groupedItems.map((product) => (
        <Grid container key={product.productId}>
          <Typography item variant="h4">
            Product: {product.items[0].productName}
            <Typography> Seller: {product.items[0].sellerName} </Typography>
          </Typography>

          {product.items.map((item) => (
            <Grid item key={item.id}>
              <Grid>
                <p>Item ID: {item.id}</p>
                <p>PIID: {item.productItemId}</p>
                <input
                  type="number"
                  value={item.quantity}
                  key={`quantity-${product.productId}-${item.id}`}
                  onChange={(e) => {
                    addToCart(item.productItemId, e.target.value);
                  }}
                ></input>
                <p>Options: {`${item.options}`} </p>
                <p>Unit Price: {item.price}</p>
                <p>Total: {item.price * item.quantity}</p>
                <p>PID: {item.productId}</p>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => {
                        toggleSelected(item.productId, item.id);
                      }}
                      name={`item-${item.id}`}
                      color="primary"
                    />
                  }
                  label="Select"
                />
                <Button onClick={() => removeFromCart(item.id)}>Remove</Button>
              </Grid>
            </Grid>
          ))}
        </Grid>
      ))}
      <p>Total Payable: {calculateTotalPrice()}</p>
    </Container>
  );
};

export default ShoppingCartPage;
