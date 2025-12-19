import axios from "axios";
import React, { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
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
import { useBanner, useSubCategory } from "./subCategoryContext";
import { useCategory } from "../category/CategoryContext";

const SubCategoryAdd = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { name, id } = useParams();
  const { handleAllCategorys, page, itemPerPage, bannertype } = useCategory();
  const {handlegetAllSubcategorys}=useSubCategory()
  const [subCategoryDetails, setSubCategoryDeatills] = useState({
    name: "",

    subcategory: "",

    subcategorythumbnail: null,
    coverImagePreview: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryDeatills((prev) => ({
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

      setSubCategoryDeatills((prev) => ({
        ...prev,
        subcategorythumbnail: file,
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
      formData.append("name", subCategoryDetails.name);
      formData.append("subcategory", subCategoryDetails.subcategory);

      formData.append(
        "subcategorythumbnail",
        subCategoryDetails.subcategorythumbnail
      );

      const res = await axios.post(
        `/api/product/category/create/subcategory/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = res.data;

      await handlegetAllSubcategorys(page, itemPerPage, bannertype);
      navigate("/subcategory");
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
          Add {name} Subcategory
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label=" Name"
                name="name"
                value={subCategoryDetails.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="SubCategory Name"
                name="subcategory"
                value={subCategoryDetails.subcategory}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Sub Category Thumbnail
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
              {subCategoryDetails.coverImagePreview && (
                <Box mt={2}>
                  <img
                    src={subCategoryDetails.coverImagePreview}
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
export default SubCategoryAdd;
