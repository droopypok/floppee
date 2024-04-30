import React from "react";

function formatCost(cost) {
  const numericCost = parseFloat(cost);
  if (isNaN(numericCost)) {
    return "Invalid cost";
  }
  const formattedCost = numericCost.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formattedCost;
}

export default formatCost;
