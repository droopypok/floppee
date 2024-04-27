import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, TextField, InputLabel, Select } from "@mui/material";

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
  return (
    <div>
      {console.log(props.selectedProduct)}
      {/* <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Product Name"
                onChange={(e) => setProductName(e.target.value)}
              ></TextField>
              <TextField
                fullWidth
                required
                label="Product Description"
                onChange={(e) => setProductDescription(e.target.value)}
              ></TextField>

              <InputLabel id="Category-select">Category</InputLabel>
              <Select
                id="Category-select"
                label="Category"
                value={props.prod}
                onChange={(e) => {
                  setProductCategory(e.target.value);
                }}
              >
                {availableCategories.length > 0 &&
                  availableCategories.map((item) => {
                    return (
                      <MenuItem
                        id={item.id}
                        key={item.id}
                        value={item.category}
                      >
                        {item.category}
                      </MenuItem>
                    );
                  })}
              </Select>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create new product
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal> */}
    </div>
  );
}
