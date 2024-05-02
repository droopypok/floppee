import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";
import { Container, Grid, Typography } from "@mui/material";
import formatCost from "../components/CostFormatter";

const Profile = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const [orderedItems, setOrderedItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState([]);

  const groupItems = () => {
    console.log(orderedItems);
    const sortedShoppingCart = [...orderedItems].sort((a, b) => {
      if (a.productId !== b.productId) {
        return a.productId - b.productId;
      }
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

  const getAllProducts = async () => {
    const res = await fetchData(
      `/get_all_orders/${userCtx.userId}/`,
      "GET",
      undefined,
      undefined
    );
    if (res.ok) {
      setOrderedItems(res.data.orders);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    groupItems();
  }, [orderedItems]);

  return (
    <Container>
      <Typography variant="h3">Orders</Typography>
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
                    <Typography variant="body1">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body1">
                      Options: {item.options.join(" ")}
                    </Typography>
                    <Typography variant="body1">
                      Price: {formatCost(item.price)}
                    </Typography>
                    <Typography variant="body1">
                      Total: {formatCost(item.price * item.quantity)}
                    </Typography>
                    <Typography variant="body1">
                      Delivery Status:
                      {item.deliveryStatus}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Typography>
            ;
          </Grid>
        ))}
    </Container>
  );
};

export default Profile;
