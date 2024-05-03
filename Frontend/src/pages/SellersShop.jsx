import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/User";
import { Typography } from "@mui/material";

const SellersShop = () => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [orders, setOrders] = useState([]);

  const getAllPendingOrders = async () => {
    const res = await fetchData(
      `/get_all_pending_orders/${userCtx.userId}/`,
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setOrders(res.data.orders);
    }
  };

  useEffect(() => {
    getAllPendingOrders();
    console.log(orders);
  }, []);

  return (
    <div>
      <Typography>{}</Typography>
    </div>
  );
};

export default SellersShop;
