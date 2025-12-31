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
import { useGoldSchema } from "./GoldSchemaContext";
import { useCategory } from "../category/CategoryContext";

const GoldSchemaAdd = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { handlegetAllProducts, page, itemPerPage, bannertype } =
    useGoldSchema();
  const { category, handleCategorySubcategoryFilter, subcategorys } =
    useCategory();
  const [productDetails, setProductDetails] = useState({
    Scheme_Name: "",
    Monthly_Installment: "",
    Months: "",

    Total_Amount: "",
    Members: "",
    Start_Date: "",
    End_Date: "",
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
      formData.append("Scheme_Name", productDetails.Scheme_Name);
      formData.append(
        "Monthly_Installment",
        productDetails.Monthly_Installment
      );
      formData.append("Months", productDetails.Months);
      formData.append("Total_Amount", productDetails.Total_Amount);

      formData.append("Members", productDetails.Members);
      formData.append("Start_Date", productDetails.Start_Date);
      formData.append("End_Date", productDetails.End_Date);

      const res = await axios.post("/api/gold/schema/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await handlegetAllProducts(page, itemPerPage, bannertype);
      navigate("/gold-schemes");
    } catch (error) {
      console.log("error add banner", error);
      const message = error?.response?.data?.message;
      toast.error(message);
      if (message && message.includes("E11000 duplicate key error")) {
        setErrorData(
          "Series Number already exists. Please use a unique value."
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
  console.log("subcategorys", subcategorys);
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
          Add Gold Schema
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Scheme Name"
                name="Scheme_Name"
                value={productDetails.Scheme_Name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Monthly Installment"
                name="Monthly_Installment"
                value={productDetails.Monthly_Installment}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Scheme Name"
                name="schemeName"
                value={productDetails.schemeName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Months"
                name="Months"
                value={productDetails.Months}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Total Amount"
                name="Total_Amount"
                value={productDetails.Total_Amount}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Members"
                name="Members"
                value={productDetails.Members}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              type="date"
                autoComplete="off"
                label="Start Date"
                name="Start_Date"
                value={productDetails.Start_Date}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              type="date"
                autoComplete="off"
                label="End Date"
                name="End_Date"
                value={productDetails.End_Date}
                onChange={handleChange}
                fullWidth
                required
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
export default GoldSchemaAdd;
