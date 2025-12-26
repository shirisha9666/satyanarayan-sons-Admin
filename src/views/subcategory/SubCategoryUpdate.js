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
import { useBanner, useSubCategory } from "./subCategoryContext";
import { useCategory } from "../category/CategoryContext";
import { isVideo } from "../TypeOfmedia";
import { validateMediaFile } from "../HelperImageResoluation";

const SubCategoryUpdate = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { name, id } = useParams();
  const { handleAllCategorys, page, itemPerPage, bannertype } = useCategory();
  const {
    handlegetAllSubcategorys,
    subCategoryViewDetais,
    handleSubcategoryDetailsById,
  } = useSubCategory();
  let subcategoryDetailsData= subCategoryViewDetais?.category;
  const [subCategoryDetails, setSubCategoryDeatills] = useState({
    name: subcategoryDetailsData?.name || "",

    subcategory: subcategoryDetailsData?.subcategory || "",
    subcategorythumbnail: subcategoryDetailsData?.subcategorythumbnail?.url || null,
    coverImagePreview: subcategoryDetailsData?.subcategorythumbnail?.url || "",
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

    validateMediaFile({
      file,
      imageConfig: {
        width: 1920,
        height: 600,
        maxSize: 1 * 1024 * 1024,
      },
      videoConfig: {
        maxSize: 2 * 1024 * 1024,
      },
      onSuccess: ({ file, previewURL, type }) => {
        setSubCategoryDeatills((prev) => ({
          ...prev,
          subcategorythumbnail: file,
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
      formData.append("name", subCategoryDetails.name);
      formData.append("subcategory", subCategoryDetails.subcategory);

      formData.append(
        "subcategorythumbnail",
        subCategoryDetails.subcategorythumbnail
      );

      const res = await axios.patch(
        `/api/product/category/subcategory/update/${id}`,
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
        setErrorData(message);
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
    handleSubcategoryDetailsById(id);
  }, []);

  console.log("subCategoryViewDetais", subCategoryViewDetais.category);
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
          Update Subcategory
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
                Cover Media (Image / Video)
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
                × {600}. Max size: 2 MB.
              </FormHelperText>

              {subCategoryDetails?.coverImagePreview && (
                <Box mt={2}>
                  {isVideo(
                    subCategoryDetails.coverImagePreview,
                    subCategoryDetails.subcategorythumbnail
                  ) ? (
                    <video
                      src={subCategoryDetails.coverImagePreview}
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
                      src={subCategoryDetails.coverImagePreview}
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
export default SubCategoryUpdate;
