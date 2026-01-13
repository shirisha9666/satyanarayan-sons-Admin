import axios from "axios";
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
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
import { useBanner } from "./bannerContext";
import { highervalidateMediaFile, validateMediaFile } from "../HelperImageResoluation";

const BannerAdd = () => {
  const token = isAutheticated()
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate()
  const { getHomebanners, page, itemPerPage, bannertype } = useBanner()
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





const handleImageChange = (e) => {
  const file = e.target.files[0];

  highervalidateMediaFile({
    file,
    imageConfig: {
      width: 2000,
      height: 600,
      maxSize: 4 * 1024 * 1024,
    },
    videoConfig: {
      maxSize: 8 * 1024 * 1024,
    },
    onSuccess: ({ file, previewURL, type }) => {
      setBannerDetails((prev) => ({
        ...prev,
        banner: file,
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
      console.log("error add banner", error)
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
          Banner
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
                    : `${150 - bannerDetails.content.length
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

  {/* Helper Text */}
<FormHelperText>
  Please upload an image or video.
  Recommended resolution: 2000 × 600 px.
  Image max size: 4 MB. Video max size: 8 MB.
</FormHelperText>

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
