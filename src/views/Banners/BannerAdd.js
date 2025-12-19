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
import { useBanner } from "./bannerContext";

const BannerAdd = () => {
  const token=isAutheticated()
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate=useNavigate()
  const {getHomebanners,page, itemPerPage, bannertype}=useBanner()
  const [bannerDetails, setBannerDetails] = useState({
    name: "",
    subtitle: "",
    content: "",
    banneryType: "",
    banner: null,
    coverImagePreview: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBannerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("bannerDetails", bannerDetails);
  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const fileSizeInMB = file.size / (1024 * 1024);
  //       const MAX_IMAGE_SIZE_MB = 2;

  //       if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
  //         toast.error("Please select an image smaller than 2MB.");
  //         return;
  //       }

  //       // 2️⃣ DIMENSION VALIDATION
  //       const img = new Image();
  //       img.src = URL.createObjectURL(file);

  //       img.onload = () => {
  //         const width = img.width;
  //         const height = img.height;
  //         const REQUIRED_WIDTH = 1920; // Adjust as needed
  //         const REQUIRED_HEIGHT = 600;
  //         if (width !== REQUIRED_WIDTH || height !== REQUIRED_HEIGHT) {
  //           toast.error(
  //             `Invalid banner size! Please upload an image of ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px`
  //           );
  //           return;
  //         }
  //       };
  //       const previewURL = URL.createObjectURL(file);
  //       setBannerDetails((prev) => ({
  //         ...prev,
  //         banner: file,
  //         coverImagePreview: previewURL,
  //       }));
  //       img.onerror = () => {
  //         toast.error("Invalid image file.");
  //       };
  //       img.src = URL.createObjectURL(file);
  //     }
  //   };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // ----------------------------
  //   // 1️⃣ FILE SIZE VALIDATION (2MB)
  //   // ----------------------------
  //   const MAX_IMAGE_SIZE_MB = 2;
  //   const fileSizeInMB = file.size / (1024 * 1024);

  //   // if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
  //   //   toast.error("Please upload an image smaller than 2MB.");
  //   //   return;
  //   // }

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

  //     setBannerDetails((prev) => ({
  //       ...prev,
  //       banner: file,
  //       coverImagePreview: previewURL,
  //     }));
  //   };

  //   img.onerror = () => {
  //     toast.error("Invalid image file.");
  //   };

  //   img.src = URL.createObjectURL(file); // Must come after setting onload
  // };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewURL = URL.createObjectURL(file);

  // 🔹 Detect type
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");

  // ----------------------------
  // 🎥 VIDEO → NO IMAGE VALIDATION
  // ----------------------------
  if (isVideo) {
    setBannerDetails((prev) => ({
      ...prev,
      banner: file,
      coverImagePreview: previewURL,
      coverImageType: "video",
    }));
    return;
  }

  // ----------------------------
  // 🖼️ IMAGE VALIDATION
  // ----------------------------
  if (isImage) {
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const REQUIRED_WIDTH = 1920;
      const REQUIRED_HEIGHT = 600;
      const TOLERANCE = 5;

      const widthValid = Math.abs(width - REQUIRED_WIDTH) <= TOLERANCE;
      const heightValid = Math.abs(height - REQUIRED_HEIGHT) <= TOLERANCE;

      // Optional validation (enable if needed)
      // if (!widthValid || !heightValid) {
      //   toast.error(
      //     "Invalid banner size! Please upload an image close to 1920x600px."
      //   );
      //   return;
      // }

      setBannerDetails((prev) => ({
        ...prev,
        banner: file,
        coverImagePreview: previewURL,
        coverImageType: "image",
      }));
    };

    img.onerror = () => {
      toast.error("Invalid image file.");
    };

    img.src = previewURL;
    return;
  }

  // ----------------------------
  // ❌ Unsupported file
  // ----------------------------
  toast.error("Unsupported file type. Upload image or video only.");
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("name", bannerDetails.name);
      formData.append("subtitle", bannerDetails.subtitle);
      formData.append("content", bannerDetails.content);
      formData.append("banner", bannerDetails.banner);
      formData.append("bannerType", bannerDetails.banneryType);
      console.log("formData", formData);

      const res = await axios.post("/api/homeBanner/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;

   await getHomebanners(page, itemPerPage, bannertype);
      navigate("/banner");
    } catch (error) {
      console.log("error add banner",error)
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
          Campaigning Banner
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Banner Name"
                name="name"
                value={bannerDetails.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Banner Type"
                name="banneryType"
                value={bannerDetails.banneryType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="Home Banner">Home Banner</MenuItem>
                <MenuItem value="Campaign banner">Campaign banner</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Subtitle"
                name="subtitle"
                value={bannerDetails.subtitle}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Content"
                name="content"
                value={bannerDetails.content}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                inputProps={{ minLength: 10, maxLength: 150 }}
                helperText={
                  bannerDetails.content.length < 10
                    ? `Minimum 10 characters required (${bannerDetails.content.length}/150)`
                    : `${
                        150 - bannerDetails.content.length
                      } characters remaining`
                }
                error={
                  bannerDetails.content.length > 0 &&
                  bannerDetails.content.length < 10
                }
              />
            </Grid>

            {/* <Grid item xs={12}>
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
              {bannerDetails.coverImagePreview && (
                <Box mt={2}>
                  <img
                    src={bannerDetails.coverImagePreview}
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

  {bannerDetails.coverImagePreview && (
    <Box mt={2}>
      {bannerDetails.coverImageType === "video" ? (
        <video
          src={bannerDetails.coverImagePreview}
          controls
          muted
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      ) : (
        <img
          src={bannerDetails.coverImagePreview}
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
export default BannerAdd;
