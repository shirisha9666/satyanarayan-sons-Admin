import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";

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
import { useAbout } from "./AboutContext";

import { validateMediaFile } from "../HelperImageResoluation";

const AboutUpdate = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    handlegetAllData,
    page,
    itemPerPage,
    bannertype,
    handleOneBanner,
    BannerOneDetails,
  } = useAbout();

  const [homeCollections, setHomeCollection] = useState({
    content: BannerOneDetails?.content || "",

    Thumbnail: BannerOneDetails?.Thumbnail?.url || null,
    coverImagePreview: BannerOneDetails?.Thumbnail?.url || "",
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
        setHomeCollection((prev) => ({
          ...prev,
          Thumbnail: file,
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
      formData.append("content", homeCollections.content);

      formData.append("Thumbnail", homeCollections.Thumbnail);

      const res = await axios.patch(`/api/about/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await handlegetAllData(page, itemPerPage, bannertype);
      toast.success("About Section Updated Successfully");
      navigate("/about-section");
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
  useEffect(() => {
    handleOneBanner(id);
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
          About Update
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12}>
  <TextField
    label="Content"
    name="content"
    value={homeCollections.content || ""}
    onChange={handleChange}
    fullWidth
    required
    multiline
    minRows={6}
    InputLabelProps={{ shrink: true }}
  />
</Grid> */}

            <Grid item xs={12}>
              <TextareaAutosize
                name="content"
                value={homeCollections.content || ""}
                onChange={handleChange}
                minRows={6}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "16px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </Grid>

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

              {homeCollections.coverImagePreview && (
                <Box mt={2}>
                  {homeCollections.coverImageType === "video" ? (
                    <video
                      src={homeCollections.coverImagePreview}
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
export default AboutUpdate;
