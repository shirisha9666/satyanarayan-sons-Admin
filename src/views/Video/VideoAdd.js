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
import {  useVideo } from "./VideoContext";
import { highervalidateMediaFile, validateMediaFile } from "../HelperImageResoluation";

const VideoAdd = () => {
  const token = isAutheticated()
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate()
  const { handlegetAllData, page, itemPerPage, bannertype } = useVideo()
  const [homeCollections, setHomeCollection] = useState({
    name: "",
    selectedType: "",
    mediaType: "",

    Thumbnail: null,
    coverImagePreview: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHomeCollection((prev) => ({
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
         maxSize: 10 * 1024 * 1024,
       },
       videoConfig: {
         maxSize: 10 * 1024 * 1024,
       },
       onSuccess: ({ file, previewURL, type }) => {
         setHomeCollection((prev) => ({
           ...prev,
           video: file,
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
      formData.append("selectedType", homeCollections.selectedType);
      formData.append("name", homeCollections.name);

      formData.append("mediaType", homeCollections.mediaType);
      formData.append("Thumbnail", homeCollections.Thumbnail);



      const res = await axios.post("/api/trending/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = res.data;

      await handlegetAllData(page, itemPerPage, bannertype);
      navigate("/home-collections");
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
          Add Home Collections
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Type"
                name="selectedType"
                value={homeCollections.selectedType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="New_Arrivals">New_Arrivals</MenuItem>
                <MenuItem value="Trendy">Trendy</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Name"
                name="name"
                value={homeCollections.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Media Type"
                name="mediaType"
                value={homeCollections.mediaType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>

              </TextField>
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
                Please upload an video.
                Recommended resolution: 2000 × 600 px.
                 Video max size: 10 MB.
              </FormHelperText>

              {homeCollections.coverImagePreview && (
                <Box mt={2}>
                  {homeCollections.coverImageType === "video" ? (
                    <video
                      src={homeCollections.coverImagePreview}
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
                      src={homeCollections.coverImagePreview}
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
export default VideoAdd;
