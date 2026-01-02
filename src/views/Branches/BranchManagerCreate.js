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
import { useBranche } from "./BranchesContext";

const BranchManagerCreate = () => {
  const token = isAutheticated();
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errordata, setErrorData] = useState("");
  const [branchManagers, setBranchManagers] = useState([]);
  const navigate = useNavigate();
  const { handlegetAllData, page, itemPerPage, searchName } = useBranche();
  const [homeCollections, setHomeCollection] = useState({
    managerId: "",
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
      formData.append("managerId", homeCollections.managerId);
      const res = await axios.patch(`/api/branch/manager/${id}`, formData, {
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
  const getAllbranchMannages = async () => {
    try {
      let resp = await axios.get(`/api/branch/get/all/managers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBranchManagers(resp?.data?.result);
    } catch (error) {
      console.log("error update mannager getAllbranchMannages", error);
      const message = error?.response?.data?.message;
    }
  };
  useEffect(() => {
    getAllbranchMannages();
  }, []);
  console.log("branchManagers", branchManagers);
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
          Add Manager
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Choose Manager"
                name="managerId"
                value={homeCollections.managerId}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Choose Mannager</MenuItem>
                {branchManagers.map((item) => (
                  <MenuItem value={item._id}>{item.name}</MenuItem>
                ))}
              </TextField>
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
export default BranchManagerCreate;
