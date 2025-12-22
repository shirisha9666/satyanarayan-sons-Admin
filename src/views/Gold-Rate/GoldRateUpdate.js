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

const GoldRateUpdate = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { handlegetAllProducts, page, itemPerPage, bannertype } = useGoldRate();
  const { category, handleCategorySubcategoryFilter, subcategorys } =
    useCategory();
  const [productDetails, setProductDetails] = useState({
    productName: "",
    categoryId: "",
    subcategoryId: "",

    productImage: null,
    coverImagePreview: "",
  });


  const monthsList = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

  console.log("category", category?.result);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ----------------------------
    // 1️⃣ FILE SIZE VALIDATION (2MB)
    // ----------------------------
    const MAX_IMAGE_SIZE_MB = 2;
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
      toast.error("Please upload an image smaller than 2MB.");
      return;
    }

    // ----------------------------
    // 2️⃣ DIMENSION VALIDATION
    // ----------------------------
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Required Banner Size
      const REQUIRED_WIDTH = 1920;
      const REQUIRED_HEIGHT = 600;

      // Allow small tolerance (±5px)
      const WIDTH_TOLERANCE = 5;
      const HEIGHT_TOLERANCE = 5;

      const widthValid = Math.abs(width - REQUIRED_WIDTH) <= WIDTH_TOLERANCE;
      const heightValid =
        Math.abs(height - REQUIRED_HEIGHT) <= HEIGHT_TOLERANCE;

      // if (!widthValid || !heightValid) {
      //   toast.error(
      //     `Invalid banner size! Please upload an image close to 1920x600px for perfect homepage fit.`
      //   );
      //   return;
      // }

      // ----------------------------
      // 3️⃣ VALID IMAGE → SET PREVIEW
      // ----------------------------
      const previewURL = URL.createObjectURL(file);

      setProductDetails((prev) => ({
        ...prev,
        productImage: file,
        coverImagePreview: previewURL,
      }));
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
    };

    img.src = URL.createObjectURL(file); // Must come after setting onload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("productName", productDetails.productName);
      formData.append("categoryId", productDetails.categoryId);
      formData.append("subcategoryId", productDetails.subcategoryId);
      formData.append("productImage", productDetails.productImage);

      const res = await axios.post("/api/product/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;

      await handlegetAllProducts(page, itemPerPage, bannertype);
      navigate("/products");
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
          Update Gold Rate
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
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
                label="Monthly Installment"
                name="monthlyInstallment"
                value={productDetails.monthlyInstallment}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            
            <Grid item xs={12}>
              <TextField
                select
                label="Select Months Type"
                name="months"
                value={productDetails.months}
                onChange={handleChange}
                fullWidth
                required
              >
                {monthsList.map((month) => (
                  <MenuItem
                    value={month.value}
                    onClick={() => handleCategorySubcategoryFilter(month.value)}
                  >
                    {month.label}
                  </MenuItem>
                ))}
              </TextField>
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
export default GoldRateUpdate;
