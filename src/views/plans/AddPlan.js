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
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import axios from "axios";
import { isAutheticated } from "src/auth";
import toast from "react-hot-toast";
import { usePlan } from "./PlanContext";
import { useNavigate } from "react-router-dom";
import { useSeries } from "../series/SeriesContext";

const AddPlan = () => {
  const [addPlans, setAddplans] = useState({
    Plan: "",
    Gst: "",
    Price: "",
    Total_Price: "",
    Duration: "",
    features: [""],
  });
  const token = isAutheticated();
  const [planLoading, setPlanLoading] = useState(false);
  const { getgst, handeAllPlans } = usePlan();

  const plans = ["1 Month", "3 Months", "6 Months", "1 Year"];
  const months = ["1 Month", "3 Month", "6 Month", "1 Year"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddplans((prevPlan) => {
      if (name === "Gst") {
        const getItem = getgst.find((item) => item._id === value);
        const gstPercent = getItem ? getItem.Gst : 0;
        console.log("gstPercent", gstPercent);
        const Price = parseFloat(prevPlan.Price) || 0;

        let TotalPrice = (Price + (Price * gstPercent) / 100).toFixed(2);

        return {
          ...prevPlan,
          Gst: value,
          Total_Price: TotalPrice,
        };
      }
      return { ...prevPlan, [name]: value };
    });
  };

  const addfeature = (type) => {
    setAddplans({ ...addPlans, [type]: [...addPlans[type], ""] });
  };
  const removeFeature = (type, index) => {
    const newFeatures = addPlans[type].filter((_, i) => i !== index);
    setAddplans({ ...addPlans, [type]: newFeatures });
  };

  const handleFeatureChange = (type, index, value) => {
    setAddplans((prevPlan) => {
      const newFeatures = [...prevPlan[type]];
      newFeatures[index] = value;
      return { ...prevPlan, [type]: newFeatures };
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPlanLoading(true);
      const res = await axios.post("/api/package/create", addPlans, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res?.data?.message);
      await handeAllPlans(1, undefined, undefined);
      navigate("/plans");
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
          Add Plan
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Plan Type */}
            <Grid item xs={12} sm={12}>
              <TextField
                select
                fullWidth
                label="Plan Name"
                name="Plan"
                value={addPlans.Plan}
                onChange={handleChange}
              >
                {plans.map((name) => (
                  <MenuItem value={name}>{name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            {/*Duration */}
            <Grid item xs={12} sm={12}>
              <TextField
                select
                fullWidth
                label="Plan Duration"
                name="Duration"
                value={addPlans.Duration}
                onChange={handleChange}
              >
                {months.map((name) => (
                  <MenuItem value={name}>{name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Monthly Price */}
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Price"
                name="Price"
                type="number"
                value={addPlans.Price}
                onChange={handleChange}
              />
            </Grid>
            {/* gst */}
            <Grid item xs={12} sm={12}>
              <TextField
                select
                fullWidth
                label="GST"
                name="Gst"
                // value={plan.GST}
                onChange={handleChange}
              >
                {getgst?.map((item) => (
                  <MenuItem value={item._id} key={item._id}>
                    {item.Gst}%
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Total Price"
                name="Total_Price"
                type="number"
                value={addPlans.Total_Price}
                onChange={handleChange}
                disabled
              />
            </Grid>

            {/* yeaerFeatures */}
            <Grid item xs={12}>
              <Typography variant="h6"> Features</Typography>
              {addPlans?.features?.map((feature, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ mb: 1 }}
                >
                  <TextField
                    fullWidth
                    label={` Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) =>
                      handleFeatureChange("features", index, e.target.value)
                    }
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeFeature("features", index)}
                    disabled={addPlans.features.length === 1}
                  >
                    <RemoveCircle />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => addfeature("features", index)}
                  >
                    <AddCircle />
                  </IconButton>
                </Box>
              ))}
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {planLoading ? <CircularProgress size={25} /> : "Save Plan"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddPlan;
