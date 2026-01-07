import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Stack,
  Chip,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ShieldIcon from "@mui/icons-material/Shield";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import { useEmployees } from "./EmployeesContext";
import { useParams } from "react-router-dom";

const EmployeeDetails = () => {
  const { id } = useParams();
  const {employeDetails,handleOneEmploye,viewBannerId } = useEmployees();
  const [loading, setLoading] = useState(false);


  if (loading) {
    return <CircularProgress />;
  }
  useEffect(()=>{
    handleOneEmploye(id)
  },[id])

  const Row = ({ label, value }) => (
    <Stack direction="row" spacing={2}>
      <Typography sx={{ width: "20%", fontWeight: 700 }}>
        {label}
      </Typography>

      <Typography fontWeight={700}>:</Typography>

      <Typography fontWeight={700}>
        {value}
      </Typography>
    </Stack>
  );

  return (
    <Container maxWidth="sm">

      <Card elevation={4}>
        <CardContent>

          <Stack alignItems="center" spacing={1.2}>
            <Avatar sx={{ width: 72, height: 72, fontSize: "2rem" }}>
              {employeDetails?.name?.charAt(0)}
            </Avatar>

            <Typography variant="h5" fontWeight={800}>
              {employeDetails?.name}
            </Typography>

            <Typography variant="caption">
              {employeDetails?.employeId}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>

            <Row label="Email" value={employeDetails?.email} />

            <Row label="Phone" value={employeDetails?.phone} />

            <Row label="Role" value={employeDetails?.role} />

            <Row label="Branch ID" value={employeDetails?.branchId?.branchName} />
                <Row label="Branch Code" value={employeDetails?.branchId?.branchCode} />

            <Row label=" Status" value={employeDetails?.isActive} />

            {/* Access array as labels */}
            <Stack direction="row" spacing={2}>
              <Typography sx={{ width: "20%", fontWeight: 700 }}>
                Access
              </Typography>

              <Typography fontWeight={700}>:</Typography>

              <Box>
                {employeDetails?.access?.map((a, i) => (
                  <Typography key={i} fontWeight={700} py={0.5}>
                    {i + 1}. {a}
                  </Typography>
                ))}
              </Box>
            </Stack>

            <Row label="Created At" value={employeDetails?.createdAt} />

            <Row label="Last Login" value={employeDetails?.lastLogin} />

          </Stack>

        </CardContent>
      </Card>

    </Container>
  );
};


export default EmployeeDetails;
