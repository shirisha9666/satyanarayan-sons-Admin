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
import { useBranche } from "./BranchesContext";
import { validateMediaFile } from "../HelperImageResoluation";

const BranchCreate = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const navigate = useNavigate();
  const { handlegetAllData, page, itemPerPage, searchName } = useBranche();
  const [homeCollections, setHomeCollection] = useState({
    branchName: "",
    branchCode: "",
    address: "",

    city: "",
    state: "",

    country: "",
    pincode: "",
    contactNumber: "",
    email: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHomeCollection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("branchName", homeCollections.branchName);
      formData.append("branchCode", homeCollections.branchCode);

      formData.append("address", homeCollections.address);
      formData.append("city", homeCollections.city);

      formData.append("state", homeCollections.state);
      formData.append("country", homeCollections.country);

      formData.append("pincode", homeCollections.pincode);
      formData.append("contactNumber", homeCollections.contactNumber);
      formData.append("email", homeCollections.email);

      const res = await axios.post("/api/branch/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      

      await handlegetAllData(page, itemPerPage, searchName);
      navigate("/Branches");
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
  const statesList = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

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
          Add Branch
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Branch Name"
                name="branchName"
                value={homeCollections.branchName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Branch Code"
                name="branchCode"
                value={homeCollections.branchCode}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Email"
                name="email"
                value={homeCollections.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Country"
                name="country"
                value={homeCollections.country}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="State"
                name="state"
                value={homeCollections.state}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="off"
              >
                {statesList.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="City"
                name="city"
                value={homeCollections.city}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Address"
                name="address"
                value={homeCollections.address}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Pincode"
                name="pincode"
                value={homeCollections.pincode}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                label="Contact Number"
                name="contactNumber"
                value={homeCollections.contactNumber}
                onChange={handleChange}
                fullWidth
                required
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
export default BranchCreate;
