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
import { useVideo } from "./VideoContext";

import { highervalidateMediaFile, validateMediaFile } from "../HelperImageResoluation";

const VideoUpdate = () => {
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
  } = useVideo();

  const [homeCollections, setHomeCollection] = useState({
    video: BannerOneDetails?.video?.url || null,
    coverImagePreview: BannerOneDetails?.video?.url || "",
  });
  useEffect(() => {
    if (BannerOneDetails) {
      setHomeCollection({
        video: BannerOneDetails?.video?.url || null,
        coverImagePreview: BannerOneDetails?.video?.url || "",
      });
    }
  }, [BannerOneDetails]);

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

      formData.append("video", homeCollections.video);

      const res = await axios.patch(`/api/video/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await handlegetAllData(page, itemPerPage, bannertype);
      toast.success("Video Updated Successfully");
      navigate("/video-section");
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
          Video Update
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Cover Media Video
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

              <FormHelperText>
                Please upload an video.
                Recommended resolution: 2000 × 600 px.
                Video max size: 8 MB.
              </FormHelperText>
              {/* {homeCollections.coverImagePreview && (
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
              )} */}
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
export default VideoUpdate;
