import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const fetchData = useFetch();
  const productId = useParams();
  const [product, setProduct] = useState([]);

  const getProductById = async () => {
    console.log(productId);
    const res = await fetchData(
      `/product_items/${productId.id}/`,
      "GET",
      undefined,
      undefined
    );
    console.log(res);
    setProduct(res.data);
  };

  useEffect(() => {
    getProductById();
  }, []);
  return <div></div>;
};

export default ProductPage;
