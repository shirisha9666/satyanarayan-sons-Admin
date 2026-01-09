import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTransactions } from "./TransactionsContext";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function GoldSchemeDetails() {
  let { start, schemename, id, name } = useParams();

  const { userInvoices, handleAllUserInvoice } = useTransactions();
  useEffect(() => {
    handleAllUserInvoice(id);
  }, []);
  let result = userInvoices?.invoiceData;

  console.log("userInvoices", userInvoices);
  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h6" fontWeight={600}>
        Scheme Name: {schemename}
      </Typography>

      <Typography variant="h6" fontWeight={600}>
        Name: {name}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Joined on: {start}
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Total Scheme Amount" value={`₹${userInvoices?.totalAmount}`} bg="#EEF2FF" />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Total Amount Paid" value={`₹${userInvoices?.totalPaidFormatted }`} bg="#E0F2FE" />
        </Grid>
        <Grid item xs={12} md={3}>
          <SummaryCard title="Total Months" value={`${userInvoices?.totalMonths}`} bg="#e2d6bbff" />
        </Grid>
      
        <Grid item xs={12} md={3}>
          <SummaryCard title="Remaining Months" value={`${userInvoices?.reminingMonths}`} bg="#FFF7ED" />
        </Grid>
      </Grid>

      {/* Table Section */}
      <Card>
        <Box
          sx={{
            background: "linear-gradient(to right, #2563EB, #1D4ED8)",
            color: "#fff",
            px: 2,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Month-wise Transaction Details
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Invoice</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {result?.map((val, kye) => (
                <TableRow>
                  <TableCell>{val?.month}</TableCell>
                  <TableCell sx={{ color: "#2563EB", fontWeight: 500 }}>
                    {val?.InvoiceNo}
                  </TableCell>
                  <TableCell>₹{val?.monthlyPrice}</TableCell>
                  <TableCell>
                    <Chip label="Credit" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label="ACTIVE" color="warning" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DescriptionIcon />}
                    >
                      Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

/* Reusable Summary Card */
function SummaryCard({ title, value, sub, bg }) {
  return (
    <Card sx={{ background: bg }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} mt={1}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
