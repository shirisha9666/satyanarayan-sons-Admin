import React, { useEffect, useState } from "react";

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
import { useNavigate, useParams } from "react-router-dom";

const UpdatePlan = () => {
  const { id } = useParams();

  const {
    getgst,
    handeAllPlans,
    getPlan,
    handlegetByIdplan,
    planId,
    localPlanId,
    setPlanUpdateLoading,
  } = usePlan();

  const token = isAutheticated();
  const navigate = useNavigate();
  const [planLoading, setPlanLoading] = useState(false);
  console.log("getPlan",getPlan)

  const [addPlans, setAddplans] = useState({
    Plan: getPlan?.Plan,
    Gst: getPlan?.Gst?._id || "",
    Price: getPlan?.Price,
    Total_Price: getPlan?.Total_Price,
    Duration: getPlan?.Duration,
    features: getPlan?.features || [""],
    Status: getPlan?.Status,
  });

  // const plans = ["Basic", "Standard", "Premium"];
  const plans = ["1 Month", "3 Months", "6 Month", "1 Year"];
  const months = ["1 Month", "3 Month", "6 Month", "1 Year"];
  const status = ["Active", "Inactive"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddplans((prevPlan) => {
      if (name === "Gst") {
        const getItem = getgst.find((item) => item._id === value);
        const gstPercent = getItem ? getItem.Gst : 0;

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
    console.log("addPlans", addPlans);
    try {
      setPlanLoading(true);
      const res = await axios.put(`/api/package/update/${id}`, addPlans, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handeAllPlans(1, undefined, undefined);
      toast.success(res?.data?.message);
      navigate("/plans");
    } catch (error) {
      let message = error?.response?.data?.message;
      console.log("message", message);
      toast.error(message);
    } finally {
      setPlanLoading(false);
    }
  };
  // useEffect(() => {
  //   if (id) {
  //     handlegetByIdplan(id);
  //   }
  // }, [id]);
  return (
    <Container maxWidth="md">
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "600" }}>
          Update Plan
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
            {/* limit Type */}
            {/* <Grid item xs={12} sm={12}>
              <TextField
                select
                fullWidth
                label="Plan Limits"
                name="Plan"
                value={addPlans.Plan}
                onChange={handleChange}
              >
                {months.map((name) => (
                  <MenuItem value={name}>{name}</MenuItem>
                ))}
              </TextField>
            </Grid> */}
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

            <Grid item xs={12} sm={12}>
              <TextField
                select
                fullWidth
                label="Status"
                name="Status"
                value={addPlans.Status}
                onChange={handleChange}
              >
                {status?.map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Features */}
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

export default UpdatePlan;
