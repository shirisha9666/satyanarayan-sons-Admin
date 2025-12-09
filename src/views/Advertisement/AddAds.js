import React, { useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Paper,
  CircularProgress,
} from "@mui/material";

import axios from "axios";
import { isAutheticated } from "src/auth";
import toast from "react-hot-toast";
import { useAds } from "./AdContext";
import { useNavigate } from "react-router-dom";



const AddAds = () => {
  const [addads, setAddAds] = useState({
    AdPoster: null,
    coverImagePreview: "",

  });
  const token = isAutheticated();
  const [planLoading, setPlanLoading] = useState(false);
  const { handeAllAds } = useAds();



  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      const MAX_IMAGE_SIZE_MB = 2;

      if (fileSizeInMB > MAX_IMAGE_SIZE_MB) {
        toast.error("Please select an image smaller than 2MB.");
        return;
      }
      const previewURL = URL.createObjectURL(file);
      setAddAds((prev) => ({
        ...prev,
        AdPoster: file,
        coverImagePreview: previewURL,
      }));
    }
  };
  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("addads", addads)
    try {
      setPlanLoading(true);
      const formData=new FormData()
      formData.append("AdPoster", addads.AdPoster);
// formData.append("coverImagePreview", addads.coverImagePreview);

      const res = await axios.post("/api/Ads/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res?.data?.message);
      await handeAllAds(1);
      navigate("/Advertisement");
    } catch (error) {
      let message = error?.response?.data?.message;
      toast.error(message);
    } finally {
      setPlanLoading(false);
    }
  };
  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "600" }}>
          Add Advertisement
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              {/* Section Title */}
              <Typography
                variant="subtitle1"
                sx={{ fontSize: "1.1rem", fontWeight: 600, mb: 2, color: "#444" }}
              >
                Advertisement
              </Typography>

              <Button
                variant="contained"
                component="label"
                sx={{
                  background: "linear-gradient(135deg, #FF9800, #F57C00)",
                  color: "#fff",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #F57C00, #E65100)",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Upload Poster
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {/* Preview Image */}
              {addads.coverImagePreview && (
                <Box mt={3}>
                  <img
                    src={addads.coverImagePreview}
                    alt="Cover Preview"
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "cover",
                      borderRadius: "12px",
                      border: "2px solid #eee",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              )}
            </Grid>



            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {planLoading ? <CircularProgress size={25} /> : "Save Advertisement"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddAds;
