import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import StoreIcon from "@mui/icons-material/Store";

import { useBranche } from "./BranchesContext";
import { useParams } from "react-router-dom";

const ViewBranches = () => {
  const { id } = useParams();
  const { BannerOneDetails, handleOneBanner } = useBranche();

  useEffect(() => {
    handleOneBanner(id); // fetch branch details
  }, []);

  console.log("branch  details ",BannerOneDetails)

  const LabelValue = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value || "-"}
      </Typography>
    </Grid>
  );
  console.log("BannerOneDetails", BannerOneDetails);
  if (!BannerOneDetails) return null;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Branch Details
      </Typography>

      <Card sx={{ borderRadius: 3, maxWidth: 1000 }} elevation={3}>
        <CardContent>
          {/* HEADER */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <StoreIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {BannerOneDetails.branchName}
              </Typography>
            </Box>

            <Chip
              label={BannerOneDetails.isActive}
              color={
                BannerOneDetails.isActive === "Active" ? "success" : "error"
              }
              variant="outlined"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* DETAILS GRID */}
          <Grid container spacing={3}>
            <LabelValue
              label="Branch Code"
              value={BannerOneDetails.branchCode}
            />
            <LabelValue label="Branch ID" value={BannerOneDetails.branchId} />

            <LabelValue label="Address" value={BannerOneDetails.address} />
            <LabelValue label="City" value={BannerOneDetails.city} />

            <LabelValue label="State" value={BannerOneDetails.state} />
            <LabelValue label="Country" value={BannerOneDetails.country} />

            <LabelValue label="Pincode" value={BannerOneDetails.pincode} />
            <LabelValue
              label="Contact Number"
              value={BannerOneDetails.contactNumber}
            />

            <LabelValue label="Email" value={BannerOneDetails.email} />
            <LabelValue
              label="Manager Name"
              value={BannerOneDetails?.managerId?.name}
            />
            <LabelValue
              label="Manager Phone"
              value={BannerOneDetails?.managerId?.phone}
            />
            <LabelValue
              label="Manager Email"
              value={BannerOneDetails?.managerId?.email}
            />
            <LabelValue
              label="Manager EmployeId"
              value={BannerOneDetails?.managerId?.employeId}
            />

            {/* <LabelValue label="Created By" value={BannerOneDetails.createdBy} /> */}

            <LabelValue
              label="Created At"
              value={new Date(BannerOneDetails.createdAt).toLocaleString()}
            />

            <LabelValue
              label="Last Updated"
              value={new Date(BannerOneDetails.updatedAt).toLocaleString()}
            />
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewBranches;
