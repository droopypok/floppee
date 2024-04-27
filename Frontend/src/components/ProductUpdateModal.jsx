import React, { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, TextField, InputLabel, Select, MenuItem } from "@mui/material";
import useFetch from "../hooks/useFetch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductUpdateModal(props) {
  const productNameRef = useRef(props.selectedProduct.name);
  const productDescriptionRef = useRef(props.selectedProduct.description);
  const categoryRef = useRef(props.selectedProduct.category);

  const fetchData = useFetch();

  const handleUpdate = async () => {
    const updatedProduct = {
      id: props.selectedProduct.id,
      name: productNameRef.current.value,
      description: productDescriptionRef.current.value,
      category: categoryRef.current.value,
    };

    const res = await fetchData(
      "/update_product/" + props.selectedProduct.id + "/",
      "PATCH",
      updatedProduct,
      undefined
    );

    if (res.ok) {
      console.log("product updated");
      props.getSellerProducts();
      props.handleClose(); // Close the modal after successful update
    }
  };

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" noValidate sx={style}>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Product Name"
                defaultValue={props.selectedProduct.name}
                inputRef={productNameRef}
              />
              <TextField
                multiline
                fullWidth
                required
                label="Product Description"
                defaultValue={props.selectedProduct.description}
                inputRef={productDescriptionRef}
              />
              <InputLabel id="Category-select">Category</InputLabel>
              <Select
                id="Category-select"
                label="Category"
                defaultValue={props.selectedProduct.category}
                inputRef={categoryRef}
              >
                {props.availableCategories.length > 0 &&
                  props.availableCategories.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.category}>
                        {item.category}
                      </MenuItem>
                    );
                  })}
              </Select>
              <Button
                onClick={handleUpdate}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update product
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
