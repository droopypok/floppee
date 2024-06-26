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
import { useNavigate } from "react-router-dom";

const ShoppingCartPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const navigate = useNavigate();

  const [groupedItems, setGroupedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
        if (selectedItem.some((selected) => selected.id === item.id)) {
          total += item.price * item.quantity;
        }
      });
    });
    setTotalPrice(total);
  };

  const toggleSelected = (itemId) => {
    setSelectedItem((prevSelectedItems) => {
      const selectedItem = groupedItems
        .flatMap((group) => group.items)
        .find((item) => item.id === itemId);

      if (!selectedItem) {
        return prevSelectedItems;
      }

      const isSelected = prevSelectedItems.some((item) => item.id === itemId);

      if (isSelected) {
        return prevSelectedItems.filter((item) => item.id !== itemId);
      } else {
        return [...prevSelectedItems, selectedItem];
      }
    });
  };

  const addToCart = async (productId, quantity) => {
    const res = await fetchData(
      "/add_to_cart/",
      "POST",
      {
        userId: userCtx.userId,
        productId: productId,
        adjustQuantity: quantity,
      },
      userCtx.accessToken
    );
    if (res.ok) {
      getShoppingCartItems(productId);
    }
  };

  const removeFromCart = async (id) => {
    const res = await fetchData(
      `/remove_from_cart/${id}/`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      getShoppingCartItems();
    }
  };

  const getShoppingCartItems = async (productId) => {
    const res = await fetchData(
      `/view_cart/${userCtx.userId}/`,
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      const updatedShoppingCart = res.data.shopping_cart.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: item.quantity };
        } else {
          return item;
        }
      });
      userCtx.setShoppingCart(updatedShoppingCart);
    }
  };

  useEffect(() => {
    if (userCtx.userId) {
      groupItems();
    }
  }, [userCtx.shoppingCart]);

  useEffect(() => {
    calculateTotalPrice();
    console.log(selectedItem);
  }, [selectedItem, groupedItems]);

  return (
    <Container>
      <Typography variant="h3" align="center" marginTop={10}>
        CART PAGE
      </Typography>
      {userCtx.shoppingCart.length === 0 && (
        <Typography marginTop={10} variant="h1" align="center">
          pls buy smth
        </Typography>
      )}
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
                      checked={selectedItem.some(
                        (selectedItem) => selectedItem.id === item.id
                      )}
                      onChange={(e) => {
                        toggleSelected(item.id);
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
      {userCtx.shoppingCart.length > 0 && (
        <Typography variant="h5" align="right">
          Total Payable: {totalPrice}
        </Typography>
      )}
      {totalPrice !== 0 && (
        <Button
          onClick={() => navigate("/checkout", { state: { selectedItem } })}
        >
          Check out
        </Button>
      )}
    </Container>
  );
};

export default ShoppingCartPage;
