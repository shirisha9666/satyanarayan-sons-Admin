import { Box, Typography, Grid, Divider, Paper } from "@mui/material";
import { useTransactions } from "./TransactionsContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const TransctionInvoice = () => {
  let { id } = useParams();
  const { handleByIdInvoice, InvoiceDetail } = useTransactions();
  useEffect(() => {
    handleByIdInvoice(id);
  }, []);
  console.log("InvoiceDetail",InvoiceDetail)
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: 4,
        borderRadius: 2,
        fontFamily: "Roboto",
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          P Satyanarayan Sons Jewellers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Trusted by Generations
        </Typography>
        <Typography variant="caption">Hyderabad, Telangana</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Customer + Voucher Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle2" fontWeight={600}>
            Customer Details
          </Typography>

          <Typography>
            Name: <b>Mader Unnisa</b>
          </Typography>
          <Typography>Address: Hadiur Hills, Shaikpet</Typography>
          <Typography>State: Telangana</Typography>
          <Typography>Mobile: 9150832105</Typography>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            sx={{
              border: "1px solid #ccc",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography fontWeight={600} align="center">
              Deposit Voucher (Gold Scheme)
            </Typography>

            <Typography variant="body2">Receipt No: SPS/01/1012</Typography>
            <Typography variant="body2">Receipt Date: 24/12/2025</Typography>
            <Typography variant="body2">Scheme Code: SPVB</Typography>
            <Typography variant="body2">Installment: 1</Typography>
            <Typography variant="body2">Paid Installments: 4</Typography>
            <Typography variant="body2">Pending Installments: 7</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Scheme Details */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Scheme Name:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontWeight={600}>Easy Gold Saving Plan</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Gold Rate:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontWeight={600}>₹ 5,735 / gm</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Installment Amount:</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontWeight={600}>₹ 10,000</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Total */}
      <Box display="flex" justifyContent="space-between">
        <Typography fontWeight={700}>Total Amount</Typography>
        <Typography fontWeight={700}>₹ 10,000</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Footer */}
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="body2">Amount in words:</Typography>
          <Typography fontWeight={600}>Ten Thousand Rupees Only</Typography>
        </Grid>

        <Grid item xs={6} textAlign="right">
          <Typography variant="body2">Customer Signature</Typography>
          <Box mt={4} />
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography variant="caption">
          Subject to Hyderabad Jurisdiction Only
        </Typography>
      </Box>
    </Paper>
  );
};

export default TransctionInvoice;
