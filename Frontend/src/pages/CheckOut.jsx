import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";
import {
  BottomNavigation,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const CheckOut = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const location = useLocation();
  const { selectedItem } = location.state;

  const [groupedItems, setGroupedItems] = useState([]);

  useEffect(() => {
    groupItems();
  }, []);

  useEffect(() => {
    console.log(groupedItems);
  }, [groupedItems]);

  const groupItems = () => {
    const sortedShoppingCart = [...selectedItem].sort((a, b) => {
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
    return total;
  };

  return (
    <Container>
      <Grid>
        <Typography variant="h3">This is the checkout page</Typography>

        {groupedItems &&
          groupedItems.map((product) => (
            <Grid container key={product.productId} marginTop={3}>
              <Typography item variant="h4">
                Product: {product.items[0].productName}
                <Typography variant="h5" marginBottom={2}>
                  Seller: {product.items[0].sellerName}{" "}
                </Typography>
                <Grid container direction={"row"} spacing={10}>
                  {product.items.map((item) => (
                    <Grid item>
                      <Typography variant="h5">
                        Quantity: {item.quantity}
                      </Typography>
                      <Typography variant="h5">
                        Options: {`${item.options}`}{" "}
                      </Typography>
                      <Typography variant="h5">
                        Unit Price: {item.price}
                      </Typography>
                      <Typography variant="h5">
                        Total: {item.price * item.quantity}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Typography>
              ;
            </Grid>
          ))}
      </Grid>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation container style={{ justifyContent: "space-evenly" }}>
          <Typography item variant="h3">
            Total Cost: ${calculateTotalPrice()}{" "}
          </Typography>
          <Button item sx={{ fontSize: 20 }}>
            Place Order
          </Button>
        </BottomNavigation>
      </Paper>
    </Container>
  );
};

export default CheckOut;
