


import { Box, Typography, Grid, Divider } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTransactions } from "./TransactionsContext";


const TransctionInvoice = () => {
  const { id } = useParams();
  const { InvoiceDetail, handleByIdInvoice } = useTransactions();

  useEffect(() => {
    handleByIdInvoice(id);
  }, [id]);

  const invoice = InvoiceDetail.result;
  const customer = invoice?.SchemaId;
  const scheme = invoice?.goldSchemaId;
  const branch = customer?.branch;

  if (!invoice) return null;
  console.log("invoice",InvoiceDetail)

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 4,
      }}
    >
      {/* A4 Page */}
      <Box
        sx={{
          width: "210mm",
          minHeight: "297mm",
          p: 3,
          backgroundColor: "white",
          color: "black",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* HEADER */}
        <Box textAlign="center" mb={2}>
          <Typography variant="h4" sx={{ color: "#d4af37", fontWeight: "bold" }}>
            P. Satyanarayan Sons
          </Typography>
          <Typography variant="h6" sx={{ letterSpacing: 3 }}>
            JEWELLERS
          </Typography>
          <Divider sx={{ width: "50%", mx: "auto", my: 0.5 }} />
          <Typography variant="subtitle2" fontStyle="italic">
            Trusted by Generations
          </Typography>
          <Typography variant="caption">
            {branch?.address} | {branch?.contactNumber}
          </Typography>
        </Box>

        {/* MAIN BORDER */}
        <Box sx={{ border: "2px solid #333" }}>
          {/* PARTY + RECEIPT */}
          <Grid container>
            <Grid item xs={8} sx={{ borderRight: "1px solid #333", p: 1 }}>
              <Typography><b>Party Name :</b> {customer?.name}</Typography>
              <Typography><b>Address :</b> {customer?.address}</Typography>
              <Typography><b>State :</b> {branch?.state}</Typography>
              <Typography><b>Mobile :</b> {customer?.phoneNo}</Typography>
            </Grid>

            <Grid item xs={4}>
              <Box sx={{ textAlign: "center", p: 1, borderBottom: "1px solid #333" }}>
                <Typography fontWeight="bold">Deposit Voucher</Typography>
                <Typography fontStyle="italic">(Gold Scheme)</Typography>
              </Box>
              <Box sx={{ p: 1 }}>
                <Typography><b>Receipt No :</b> {invoice?.InvoiceNo}</Typography>
                <Typography>
                  <b>Date :</b>{" "}
                  {new Date(invoice?.createdAt).toLocaleDateString("en-IN")}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#333" }} />

          {/* SCHEME DETAILS */}
          <Grid container>
            <Grid item xs={8} sx={{ borderRight: "1px solid #333" }}>
              <Typography sx={{ p: 1 }}>
                <b>Scheme :</b> {scheme?.Scheme_Name}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Ticket No :</b> {customer?.ticketNo}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Gold Type :</b> {scheme?.Gold_Type}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Gold Rate :</b>{" "}
                ₹ {Number(invoice?.monthlyPrice).toLocaleString("en-IN")}
              </Typography>
                <Typography sx={{ p: 1 }}>
                <b>gold wegiht :</b> {InvoiceDetail?.goldWeight}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography sx={{ p: 1 }}>
                <b>Scheme Code :</b> {scheme?.Scheme_ID}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Installment :</b> {InvoiceDetail?.installment}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Paid :</b>{" "}
                {InvoiceDetail?.paidInstallMent }
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Pending :</b>{" "}
                {InvoiceDetail?.PendingInstallment}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#333" }} />

          {/* PAYMENT */}
          <Grid container>
            <Grid item xs={8} sx={{ borderRight: "1px solid #333", p: 1 }}>
              <Typography><b>Payment Method :</b> {invoice?.paymentMethod}</Typography>
              <Typography><b>Transaction ID :</b> {invoice?.transactionId}</Typography>
            </Grid>

            <Grid item xs={4} sx={{ p: 1 }}>
              <Typography>
                <b>Installment Amount :</b>
              </Typography>
              <Typography fontWeight="bold">
                ₹ {Number(invoice?.monthlyPrice).toLocaleString("en-IN")}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "#333" }} />

          {/* TOTAL */}
          <Box sx={{ p: 1, display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">
              ₹ {Number(invoice?.monthlyPrice).toLocaleString("en-IN")}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "#333" }} />

          {/* AMOUNT IN WORDS */}
          <Box sx={{ p: 1 }}>
            <Typography>
          {InvoiceDetail?.amountInWords}
            </Typography>
          </Box>
        </Box>

        {/* <Box textAlign="center" mt={2}>
          <Typography variant="caption">
            Subject to Hyderabad Jurisdiction Only
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
};

export default TransctionInvoice;
