import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/User";
import useFetch from "../hooks/useFetch";
import { Container, Typography } from "@mui/material";

const ShoppingCartPage = () => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();

  const [groupedItems, setGroupedItems] = useState({});

  console.log(userCtx.shoppingCart);

  const groupItems = () => {
    const grouped = userCtx.shoppingCart.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = [];
      }
      acc[item.productId].push(item);
      return acc;
    }, {});
    setGroupedItems(grouped);
  };

  useEffect(() => {
    if (userCtx.userId) {
      groupItems();
    }
  }, [userCtx.shoppingCart]);

  return (
    <Container>
      <Typography variant="h3">CHECK OUT PAGE</Typography>
      {Object.entries(groupedItems).map(([productId, items]) => (
        <div key={productId}>
          <Typography variant="h4">Product: {items[0].productName}</Typography>
          {items.map((item, index) => (
            <div key={index}>
              <p>Item ID: {item.id}</p>
              <p>Quantity: {item.quantity}</p>
              {/* Add more item details if needed */}
            </div>
          ))}
        </div>
      ))}
    </Container>
  );
};

export default ShoppingCartPage;
