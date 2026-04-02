import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Button from "@mui/material/Button";
import { Alert, Stack } from "@mui/material";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";
import { useGoldRate } from "./GoldRateContext";
import { useCategory } from "../category/CategoryContext";

const GoldRateAdd = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { handlegetAllProducts, page, itemPerPage, bannertype } = useGoldRate();
  const { category, handleCategorySubcategoryFilter, subcategorys } =
    useCategory();
  const [productDetails, setProductDetails] = useState({
    lable: "",
    rate: "",
    unit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("lable", productDetails.lable);
      formData.append("rate", productDetails.rate);
      formData.append("unit", productDetails.unit);

      const res = await axios.post("/api/gold/rate/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await handlegetAllProducts(page, itemPerPage, bannertype);
      toast.success("Gold Rate Added Successfully");
      navigate("/gold-rates");
    } catch (error) {
      console.log("error add rates", error);
      const message = error?.response?.data?.message;
      toast.error(message);
      if (message && message.includes("E11000 duplicate key error")) {
        setErrorData(
          "Series Number already exists. Please use a unique value.",
        );
      } else if (message) {
        setErrorData(message);
      } else {
        setErrorData("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setErrorData("");
    }
  };

  return (
    <div>
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",

          p: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" mb={2}>
          Add Gold Rate
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Enter gold purity number only (Example: 24 for 24Kt) "
                name="lable"
                value={productDetails.lable}
                onChange={handleChange}
                fullWidth
                required
                readOnly
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="Number"
                autoComplete="off"
                label="Rate"
                name="rate"
                value={productDetails.rate}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Unit gm"
                name="unit"
                value={productDetails.unit}
                onChange={handleChange}
                fullWidth
                required
                readOnly
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                {loading ? "Loading......" : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </form>
        {errordata && (
          <Stack sx={{ width: "100%", mt: 2, mb: 2 }}>
            <Alert variant="filled" severity="error">
              {errordata}
            </Alert>
          </Stack>
        )}
      </Box>
    </div>
  );
};
export default GoldRateAdd;
