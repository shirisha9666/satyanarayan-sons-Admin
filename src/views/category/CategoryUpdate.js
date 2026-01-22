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
import { useCategory } from "./CategoryContext";
import { validateMediaFile } from "../HelperImageResoluation";
import { isVideo } from "../TypeOfmedia";

const CategoryUpdate = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();
  const {
    handleAllCategorys,
    page,
    itemPerPage,
    bannertype,
    handlegetOneCategory,
    categoryViewDetails,
  } = useCategory();
  let categoryViewDetailsData = categoryViewDetails?.category;
  const [categoryDetails, setCategoryDetails] = useState({
    name: "",
    category: "",
    categorybanner: null,
    coverImagePreview: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // ----------------------------
  //   // 1️⃣ FILE SIZE VALIDATION (2MB)
  //   // ----------------------------
  //   const MAX_IMAGE_SIZE_MB = 2;
  //   const fileSizeInMB = file.size / (1024 * 1024);

  //   if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
  //     toast.error("Please upload an image smaller than 2MB.");
  //     return;
  //   }

  //   // ----------------------------
  //   // 2️⃣ DIMENSION VALIDATION
  //   // ----------------------------
  //   const img = new Image();
  //   img.onload = () => {
  //     const width = img.naturalWidth;
  //     const height = img.naturalHeight;

  //     // Required Banner Size
  //     const REQUIRED_WIDTH = 1920;
  //     const REQUIRED_HEIGHT = 600;

  //     // Allow small tolerance (±5px)
  //     const WIDTH_TOLERANCE = 5;
  //     const HEIGHT_TOLERANCE = 5;

  //     const widthValid = Math.abs(width - REQUIRED_WIDTH) <= WIDTH_TOLERANCE;
  //     const heightValid =
  //       Math.abs(height - REQUIRED_HEIGHT) <= HEIGHT_TOLERANCE;

  //     // if (!widthValid || !heightValid) {
  //     //   toast.error(
  //     //     `Invalid banner size! Please upload an image close to 1920x600px for perfect homepage fit.`
  //     //   );
  //     //   return;
  //     // }

  //     // ----------------------------
  //     // 3️⃣ VALID IMAGE → SET PREVIEW
  //     // ----------------------------
  //     const previewURL = URL.createObjectURL(file);

  //     setCategoryDetails((prev) => ({
  //       ...prev,
  //       categorybanner: file,
  //       coverImagePreview: previewURL,
  //     }));
  //   };

  //   img.onerror = () => {
  //     toast.error("Invalid image file.");
  //   };

  //   img.src = URL.createObjectURL(file); // Must come after setting onload
  // };

  const isVideoFile = (url) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    validateMediaFile({
      file,
      imageConfig: {
        width: 1920,
        height: 600,
        maxSize: 4 * 1024 * 1024,
      },
      videoConfig: {
        maxSize: 4 * 1024 * 1024,
      },
      onSuccess: ({ file, previewURL, type }) => {
        setCategoryDetails((prev) => ({
          ...prev,
          categorybanner: file,
          coverImagePreview: previewURL,
          coverImageType: type,
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
      formData.append("name", categoryDetails.name);
      formData.append("category", categoryDetails.category);

      formData.append("categorybanner", categoryDetails.categorybanner);

      const res = await axios.patch(
        `/api/product/category/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = res.data;

      await handleAllCategorys(page, itemPerPage, bannertype);
      navigate("/category");
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
    if (categoryViewDetailsData) {
      setCategoryDetails({
        name: categoryViewDetailsData?.name || "",
        category: categoryViewDetailsData?.category || "",
        categorybanner: categoryViewDetailsData?.categorybanner?.url || null,
        coverImagePreview: categoryViewDetailsData?.categorybanner?.url || "",
      });
    }
  }, [categoryViewDetailsData]);
  useEffect(() => {
    handlegetOneCategory(id);
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
          Category Update
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label=" Name"
                name="name"
                value={categoryDetails.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Category"
                name="category"
                value={categoryDetails.category}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Category Banner Image
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
              {categoryDetails.coverImagePreview && (
                <Box mt={2}>
                  <img
                    src={categoryDetails.coverImagePreview}
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
            </Grid> */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Cover Media Image
              </Typography>

              <Button variant="contained" component="label">
                Upload Media
                <input
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {/* Helper Text */}
              <FormHelperText>
                Please upload an image or video. Recommended resolution: {1920}{" "}
                × {600}. Max size: 4 MB.
              </FormHelperText>

              {categoryDetails.coverImagePreview && (
                <Box mt={2}>
                  {isVideo(
                    categoryDetails.coverImagePreview,
                    categoryDetails.categorybanner,
                  ) ? (
                    <video
                      src={categoryDetails.coverImagePreview}
                      controls
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ) : (
                    <img
                      src={categoryDetails.coverImagePreview}
                      alt="Cover Preview"
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}
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
export default CategoryUpdate;
