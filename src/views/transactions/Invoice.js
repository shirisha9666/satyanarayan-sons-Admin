// import React, { useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Divider,
// } from "@mui/material";
// import { useTransactions } from "./TransactionsContext";
// import { useParams } from "react-router-dom";

// const TransctionInvoice = () => {
//   let { id } = useParams();
//   const { InvoiceDetail, handleByIdInvoice } = useTransactions();
//   useEffect(() => {
//     handleByIdInvoice(id);
//   }, []);
//   return (
//     <Box
//       sx={{
//         width: "210mm",
//         minHeight: "297mm",
//         padding: "20px",
//         backgroundColor: "white",
//         color: "black",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       {/* Header */}
//       <Box sx={{ textAlign: "center", mb: 2 }}>
//         {/* Placeholder for Logo */}
//         <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
//           <Box
//             sx={{
//               width: 80,
//               height: 80,
//               border: "1px dashed grey",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: "50%",
//             }}
//           >
//             <Typography variant="caption">Logo</Typography>
//           </Box>
//         </Box>
//         <Typography
//           variant="h4"
//           sx={{ color: "#d4af37", fontWeight: "bold", fontFamily: "serif" }}
//         >
//           P. Satyanaraayan Sons
//         </Typography>
//         <Typography variant="h6" sx={{ letterSpacing: 3, fontWeight: "bold" }}>
//           JEWELLERS
//         </Typography>
//         <Divider
//           sx={{ width: "50%", margin: "5px auto", borderColor: "black" }}
//         />
//         <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
//           Trusted by Generations
//         </Typography>
//         <Typography variant="caption" display="block">
//           {InvoiceDetail?.branch?.address} |{" "}
//           {InvoiceDetail?.branch?.contactNumber}
//         </Typography>
//       </Box>

//       {/* Main Content Border */}
//       <Box sx={{ border: "2px solid #333", height: "100%" }}>
//         {/* Top Section: Party Details & Voucher Title */}
//         <Grid container>
//           {/* Left Side: Party Details */}
//           <Grid item xs={8} sx={{ borderRight: "1px solid #333", p: 1 }}>
//             <Grid container spacing={1}>
//               <Grid item xs={3}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Party Name
//                 </Typography>
//               </Grid>
//               <Grid item xs={9}>
//                 <Typography variant="body2">BADER UNNISA</Typography>
//               </Grid>

//               <Grid item xs={3}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Address
//                 </Typography>
//               </Grid>
//               <Grid item xs={9}>
//                 <Typography variant="body2">
//                   8-1-299/B/19, MADHUR HILLS, SHAIKPET, HYDERABAD-500008
//                 </Typography>
//               </Grid>

//               <Grid item xs={3}>
//                 <Typography variant="body2" fontWeight="bold">
//                   State
//                 </Typography>
//               </Grid>
//               <Grid item xs={9}>
//                 <Typography variant="body2">Telangana (36)</Typography>
//               </Grid>

//               <Grid item xs={3}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Mobile No.
//                 </Typography>
//               </Grid>
//               <Grid item xs={9}>
//                 <Typography variant="body2">9550862305</Typography>
//               </Grid>
//             </Grid>
//           </Grid>

//           {/* Right Side: Voucher Title & Receipt Details */}
//           <Grid item xs={4}>
//             <Box
//               sx={{
//                 height: "80px",
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 borderBottom: "1px solid #333",
//                 backgroundColor: "#f5f5f5",
//               }}
//             >
//               <Typography variant="h6" fontStyle="italic" fontWeight="bold">
//                 Deposit Voucher
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 fontStyle="italic"
//                 fontWeight="bold"
//               >
//                 (Gold Scheme)
//               </Typography>
//             </Box>
//             <Box sx={{ p: 1 }}>
//               <Grid container spacing={1}>
//                 <Grid item xs={5}>
//                   <Typography variant="body2" fontWeight="bold">
//                     Receipt No.
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={7}>
//                   <Typography variant="body2">SPGSD/ 1812</Typography>
//                 </Grid>

//                 <Grid item xs={5}>
//                   <Typography variant="body2" fontWeight="bold">
//                     Receipt Dt.
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={7}>
//                   <Typography variant="body2">24/12/2025</Typography>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>
//         </Grid>

//         <Divider sx={{ borderColor: "#333" }} />

//         {/* Scheme Details Row */}
//         <Grid container>
//           <Grid item xs={8} sx={{ borderRight: "1px solid #333" }}>
//             <Box sx={{ display: "flex", borderBottom: "1px solid #333" }}>
//               <Box sx={{ width: "25%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Scheme
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "75%", p: 0.5 }}>
//                 <Typography variant="body2">
//                   SP-EASY GOLD BUYING PLAN - BONUS & AVG RATE
//                 </Typography>
//               </Box>
//             </Box>
//             <Box sx={{ display: "flex", borderBottom: "1px solid #333" }}>
//               <Box sx={{ width: "25%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Ticket No.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "75%", p: 0.5 }}>
//                 <Typography variant="body2">SPWB-1-22K11-435</Typography>
//               </Box>
//             </Box>
//             <Box sx={{ display: "flex", borderBottom: "1px solid #333" }}>
//               <Box sx={{ width: "25%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Gold Wt.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "75%", p: 0.5 }}>
//                 <Typography variant="body2">0.785</Typography>
//               </Box>
//             </Box>
//             <Box sx={{ display: "flex" }}>
//               <Box sx={{ width: "25%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Gold Rate
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "75%", p: 0.5 }}>
//                 <Typography variant="body2">12,735.00</Typography>
//               </Box>
//             </Box>
//           </Grid>

//           {/* Right Side Scheme Stats */}
//           <Grid item xs={4}>
//             <Box sx={{ display: "flex", borderBottom: "1px solid #333" }}>
//               <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Scheme Code
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "50%", p: 0.5 }}>
//                 <Typography variant="body2">SPWB</Typography>
//               </Box>
//             </Box>
//             <Box sx={{ display: "flex", borderBottom: "1px solid #333" }}>
//               <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Installment
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "50%", p: 0.5 }}>
//                 <Typography variant="body2">1</Typography>
//               </Box>
//             </Box>
//             <Box sx={{ display: "flex", borderBottom: "1px solid #333" }}>
//               <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Paid Instl.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "50%", p: 0.5 }}>
//                 <Typography variant="body2">4</Typography>
//               </Box>
//             </Box>
//             <Box sx={{ display: "flex" }}>
//               <Box sx={{ width: "50%", p: 0.5, borderRight: "1px solid #ccc" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Pending Instl.
//                 </Typography>
//               </Box>
//               <Box sx={{ width: "50%", p: 0.5 }}>
//                 <Typography variant="body2">7</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>

//         <Divider sx={{ borderColor: "#333" }} />

//         {/* Payment & Totals */}
//         <Grid container sx={{ minHeight: "150px" }}>
//           <Grid
//             item
//             xs={8}
//             sx={{ borderRight: "1px solid #333", p: 1, position: "relative" }}
//           >
//             <Grid container>
//               <Grid item xs={12}>
//                 <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
//                   Card Details
//                 </Typography>
//               </Grid>
//               <Grid item xs={5}>
//                 <Typography variant="caption">HDFC CREDIT CARD-SP</Typography>
//               </Grid>
//               <Grid item xs={2}>
//                 <Typography variant="caption">5536</Typography>
//               </Grid>
//               <Grid item xs={2}>
//                 <Typography variant="caption">icici</Typography>
//               </Grid>
//               <Grid item xs={3} textAlign="right">
//                 <Typography variant="caption">10,000.00</Typography>
//               </Grid>
//               {/* Ghost Text Overlay */}
//               <Typography
//                 sx={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   opacity: 0.1,
//                   fontSize: "4rem",
//                   fontWeight: "bold",
//                   pointerEvents: "none",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 75 YEARS
//               </Typography>
//             </Grid>
//             <Grid container sx={{ mt: 1 }}>
//               <Grid item xs={8}></Grid>
//               <Grid item xs={4} textAlign="right">
//                 <Typography variant="body2" fontWeight="bold">
//                   10,000.00
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={4} sx={{ display: "flex", flexDirection: "column" }}>
//             <Box sx={{ flexGrow: 1, p: 1 }}>
//               <Box
//                 sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
//               >
//                 <Typography variant="body2">Installment Amount</Typography>
//                 <Typography variant="body2">10,000.00</Typography>
//               </Box>
//             </Box>
//             <Box sx={{ borderTop: "1px solid #333", p: 1 }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                 <Typography variant="body2" fontWeight="bold">
//                   Total
//                 </Typography>
//                 <Typography variant="body2" fontWeight="bold">
//                   10,000.00
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>
//         </Grid>
//         <Divider sx={{ borderColor: "#333" }} />

//         <Box sx={{ p: 1 }}>
//           <Typography variant="body2">
//             <strong>Narration :</strong> JAN-25
//           </Typography>
//         </Box>
//         <Divider sx={{ borderColor: "#333" }} />

//         <Box sx={{ p: 1, display: "flex" }}>
//           <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//             Rs. In Words :
//           </Typography>
//           <Typography variant="body2" sx={{ ml: 1 }}>
//             Ten Thousand Rupees Only
//           </Typography>
//         </Box>
//       </Box>

//       {/* Footer Logos/Text - Placeholder */}
//       <Box sx={{ mt: 2, textAlign: "center", opacity: 0.5 }}>
//         <Typography variant="caption">OF TRUST</Typography>
//       </Box>
//     </Box>
//   );
// };

// export default TransctionInvoice;



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

  const invoice = InvoiceDetail;
  const customer = invoice?.SchemaId;
  const scheme = invoice?.goldSchemaId;
  const branch = customer?.branch;

  if (!invoice) return null;

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
              <Typography><b>Mobile :</b> {customer?.mobile}</Typography>
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
                <b>Ticket No :</b> {customer?.membershipNo}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Gold Type :</b> {scheme?.Gold_Type}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Gold Rate :</b>{" "}
                ₹ {Number(invoice?.monthlyPrice).toLocaleString("en-IN")}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography sx={{ p: 1 }}>
                <b>Scheme Code :</b> {scheme?.Scheme_ID}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Installment :</b> 1
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Paid :</b>{" "}
                {invoice?.paymentStatus === "SUCCESS" ? 1 : 0}
              </Typography>
              <Typography sx={{ p: 1 }}>
                <b>Pending :</b>{" "}
                {scheme?.Months - 1}
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
              <b>Rs. In Words :</b> Ten Thousand Rupees Only
            </Typography>
          </Box>
        </Box>

        <Box textAlign="center" mt={2}>
          <Typography variant="caption">
            Subject to Hyderabad Jurisdiction Only
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TransctionInvoice;
