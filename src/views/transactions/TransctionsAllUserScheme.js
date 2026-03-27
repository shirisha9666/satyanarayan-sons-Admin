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
import { CircularProgress, Grid } from "@material-ui/core";

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
  const { name } = useParams();
  const tableHeading = [
    "Scheme_Name",
    "Total_Amount",
    "Monthly_Installment",
    "Date of Joining",
    "Date of Completion",
    "Branch",
    "MeberShipNo",
    "Status",
    "Action",
  ];
  let { id } = useParams();
  const {
    usergoldScheme,
    handleUserSchemas,
    handleAllUserInvoice,
    invoiceTableLoading,
  } = useTransactions();

  let rows = usergoldScheme?.findAllPlans;
  
  console.log("usergoldScheme", usergoldScheme);
  useEffect(() => {
    handleUserSchemas(id);
  }, [id]);

  return (
    <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Name
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          : {name}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
              {tableHeading.map((val) => (
                <TableCell key={val}>{val}</TableCell>
              ))}
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
                <TableCell>₹{row?.Scheme_ID?.Total_Amount}</TableCell>
                <TableCell>₹{row?.Scheme_ID?.Monthly_Installment}</TableCell>

                <TableCell>{row?.dateOfJoining}</TableCell>

                <TableCell>{row?.dateOfCompletion}</TableCell>
                <TableCell>
                  {typeof row?.branch === "string"
                    ? row?.branch
                    : row?.branch?.branchName || "-"}
                </TableCell>

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
                    onClick={async () => {
                      await handleAllUserInvoice(row?._id);
                      navigate(
                        `/Customers/All/invoices/${row?.dateOfJoining}/${row?.Scheme_ID?.Scheme_Name}/${name}/${row?._id}`
                      );
                    }}
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon />}
                  >
                    {invoiceTableLoading === row?._id ? (
                      <CircularProgress size={25} />
                    ) : (
                      "View"
                    )}
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
