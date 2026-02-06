import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import {
  FormControl,
  FormHelperText,
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
import { useProduct } from "./ProductContenxt";
import { useCategory } from "../category/CategoryContext";
import { validateMediaFile } from "../HelperImageResoluation";

const ProductUpdate = () => {
  const token = isAutheticated();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const {
    handlegetAllProducts,
    page,
    itemPerPage,
    bannertype,
    productViewDetails,
    handlegetOneProduct,
    searchBtn,searchInput
  } = useProduct();
  const { category, handleCategorySubcategoryFilter, subcategorys } =
    useCategory();
  let productView = productViewDetails?.product;
  const [productDetails, setProductDetails] = useState({
    productName: "",
    categoryId: "",
    subcategoryId: "",

    productImage: null,
    coverImagePreview: "",
  });

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
  
      validateMediaFile({
        file,
        imageConfig: {
          width: 1920,
          height: 600,
          maxSize: 10 * 1024 * 1024,
        },
        videoConfig: {
          maxSize: 10 * 1024 * 1024,
        },
        onSuccess: ({ file, previewURL, type }) => {
          setProductDetails((prev) => ({
            ...prev,
            productImage: file,
            coverImagePreview: previewURL,
          }));
        },
      });
  
      e.target.value = ""; // allow re-upload same file
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

      const res = await axios.patch(`/api/product/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;

      // await handlegetAllProducts(page, itemPerPage, bannertype);
         await handlegetAllProducts(page, itemPerPage, searchBtn,searchInput);
      navigate("/products");
    } catch (error) {
      console.log("error add banner", error);
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

  useEffect(() => {
    if (productView) {
      setProductDetails({
        productName: productView?.productName || "",
        categoryId: productView?.categoryId?._id || "",
        subcategoryId: productView?.subcategoryId?._id || "",

        productImage: productView?.productImage?.url || null,
        coverImagePreview: productView?.productImage?.url || "",
      });
    }
  }, [productView]);
  useEffect(() => {
    handlegetOneProduct(id);
  }, [id]);

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
          Update Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Product Name"
                name="productName"
                value={productDetails.productName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Category Type"
                name="categoryId"
                value={productDetails.categoryId}
                onChange={handleChange}
                fullWidth
              >
                {category?.result?.map((cat) => (
                  <MenuItem
                    value={cat._id}
                    onClick={() => handleCategorySubcategoryFilter(cat._id)}
                  >
                    {cat.category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                select
                label="Select Subcategory Type"
                name="subcategoryId"
                value={productDetails.subcategoryId}
                onChange={handleChange}
                fullWidth
              >
                {subcategorys.map((subcat) => (
                  <MenuItem value={subcat._id}>{subcat.subcategory}</MenuItem>
                ))}
              </TextField>
            </Grid> */}
            <Grid item xs={12}>
              <TextField
                select
                label="Select Subcategory Type"
                name="subcategoryId"
                value={productDetails.subcategoryId}
                onChange={handleChange}
                fullWidth
              >
                {subcategorys.map((subcat) => (
                  <MenuItem key={subcat._id} value={subcat._id}>
                    {subcat.subcategory}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Cover Image
              </Typography>
              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              <FormHelperText>
                Please upload an image . Recommended resolution: {1920} × {600}.
                Max size: 10 MB.
              </FormHelperText>
              {productDetails.coverImagePreview && (
                <Box mt={2}>
                  <img
                    src={productDetails.coverImagePreview}
                    alt="Cover Preview"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
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
export default ProductUpdate;
