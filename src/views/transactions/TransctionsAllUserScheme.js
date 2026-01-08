import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactions } from "./TransactionsContext";
import { useEffect } from "react";

// const rows = [
//   {
//     plan: "Suma Family Gold",
//     joining: "07 Jan 2026",
//     completion: "Sep 07 2026",
//     status: "ACTIVE",
//   },
//   {
//     plan: "Festival Dhanteras Plan",
//     joining: "07 Jan 2026",
//     completion: "Dec 07 2026",
//     status: "SUCCESS",
//   },
//   {
//     plan: "Suma Family Gold",
//     joining: "07 Jan 2026",
//     completion: "Sep 07 2026",
//     status: "PENDING",
//   },
//   {
//     plan: "Lakshmi Monthly Gold",
//     joining: "07 Jan 2026",
//     completion: "Nov 07 2026",
//     status: "PENDING",
//   },
// ];

// 🔹 Status Color Handler
const statusColor = (status) => {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "SUCCESS":
      return "default";
    case "PENDING":
      return "warning";
    default:
      return "default";
  }
};

export default function UserAllSchemesTable() {
  const navigate = useNavigate();
  const tableHeading = [
    "Scheme_Name",
    "Total_Amount",
    "Monthly_Installment",
    "Date of Joining",
    "Date of Completion",
    "MeberShipNo",
    "Status",
    "Action"
  ];
  let { id } = useParams();
  const { usergoldScheme, handleUserSchemas } = useTransactions();
  let rows = usergoldScheme?.findAllPlans;

  console.log("usergoldScheme", usergoldScheme);
  useEffect(() => {
    handleUserSchemas(id);
  }, [id]);

  return (
    <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              {tableHeading.map((val) => (
                <TableCell>{val}</TableCell>
              ))}
              {/* <TableCell>Scheme_ID</TableCell>
              <TableCell>Date of Joining</TableCell>
              <TableCell>Date of Completion</TableCell>
                        <TableCell>MeberShipNo</TableCell>
              <TableCell>Status</TableCell>
                  
              <TableCell align="right">Action</TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography fontWeight={600}>
                    {row?.Scheme_ID?.Scheme_Name}
                  </Typography>
                </TableCell>
                     <TableCell>{row?.Scheme_ID?.Total_Amount}</TableCell>
                <TableCell>{row?.Scheme_ID?.Monthly_Installment}</TableCell>

                <TableCell>{row?.dateOfJoining}</TableCell>

   <TableCell>{row?.dateOfCompletion}</TableCell>

                <TableCell>{row?.membershipNo}</TableCell>
                <TableCell>
                  <Chip
                    label={row?.status}
                    size="small"
                    color={statusColor(row?.status)}
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Button
                    onClick={() =>
                      navigate(
                        `/Transactions/All/invoices/${row?.Scheme_ID?._id}`
                      )
                    }
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon />}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
