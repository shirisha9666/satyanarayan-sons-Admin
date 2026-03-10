import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import Button from "@mui/material/Button";
import { Alert, Stack } from "@mui/material";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";
import { useSubCategory } from "./subCategoryContext";
import { useCategory } from "../category/CategoryContext";

const SubCategoryAdd = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { name, id } = useParams();
  const { page, itemPerPage } = useCategory();
  const { handlegetAllSubcategorys, categoryBtn, seachSubCategory } =
    useSubCategory();

  const [subCategoryDetails, setSubCategoryDeatills] = useState({
    name: "",
    subcategory: "",

    // image
    subcategorythumbnail: null,
    thumbnailPreview: "",

    // video banner
    bannerVideo: null,
    bannerPreview: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryDeatills((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file for thumbnail.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setSubCategoryDeatills((prev) => ({
      ...prev,
      subcategorythumbnail: file,
      thumbnailPreview: preview,
    }));
  };

  const handleBannerVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a video file for banner.");
      return;
    }

    const preview = URL.createObjectURL(file);

    setSubCategoryDeatills((prev) => ({
      ...prev,
      bannerVideo: file,
      bannerPreview: preview,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", subCategoryDetails.name);
      formData.append("subcategory", subCategoryDetails.subcategory);

      if (subCategoryDetails.subcategorythumbnail) {
        formData.append(
          "subcategorythumbnail",
          subCategoryDetails.subcategorythumbnail,
        );
      }

      if (subCategoryDetails.bannerVideo) {
        formData.append("bannerVideo", subCategoryDetails.bannerVideo);
      }

      await axios.post(`/api/product/category/create/subcategory/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await handlegetAllSubcategorys(page, itemPerPage, categoryBtn, seachSubCategory);
      navigate("/subcategory");
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      if (message && message.includes("E11000 duplicate key error")) {
        setErrorData("Series Number already exists. Please use a unique value.");
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
                Subcategory Thumbnail (Image)
              </Typography>

              <Button variant="contained" component="label">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleThumbnailChange}
                />
              </Button>

              {subCategoryDetails.thumbnailPreview && (
                <Box mt={2}>
                  <img
                    src={subCategoryDetails.thumbnailPreview}
                    alt="Thumbnail Preview"
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
              <Typography variant="subtitle1" mb={1}>
                Banner Video
              </Typography>

              <Button variant="contained" component="label">
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleBannerVideoChange}
                />
              </Button>

              {subCategoryDetails.bannerPreview && (
                <Box mt={2}>
                  <video
                    src={subCategoryDetails.bannerPreview}
                    controls
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
                {loading ? <CircularProgress size={25} /> : "Submit"}
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
