import {
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Chip,
  Button,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTransactions } from "./TransactionsContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { CircularProgress } from "@material-ui/core";

const normalizeRole = (role) => String(role || "").trim().toLowerCase();

const OFFLINE_PAYMENT_METHODS = [
  { label: "Cash", value: "CASH" },
  { label: "UPI", value: "UPI" },
  { label: "Card", value: "CARD" },
  { label: "Net Banking", value: "NET_BANKING" },
];

export default function GoldSchemeDetails() {
  let { start, schemename, id, name } = useParams();
  const navigate = useNavigate()

  const {
    userInvoices,
    handleAllUserInvoice,
    InvoiceDetailLoading,
    handleByIdInvoice,
    markInvoicePaidOffline,
    markOfflineLoadingId,
    accessData,
    accessLoading,
  } = useTransactions();

  const role = normalizeRole(accessData?.role);
  const canManageOffline =
    role === "branch_manager" || role === "employee";

  const [offlineDialogOpen, setOfflineDialogOpen] = useState(false);
  const [offlinePayment, setOfflinePayment] = useState({
    invoiceId: null,
    paymentMethod: "CASH",
    transactionId: "",
  });

  useEffect(() => {
    handleAllUserInvoice(id);
  }, []);
  let result = userInvoices?.invoiceData;

  const selectedInvoice = useMemo(() => {
    if (!offlinePayment.invoiceId) return null;
    return result?.find((r) => String(r?._id) === String(offlinePayment.invoiceId));
  }, [offlinePayment.invoiceId, result]);

  const openOfflineDialog = (invoiceId) => {
    setOfflinePayment({
      invoiceId,
      paymentMethod: "CASH",
      transactionId: "",
    });
    setOfflineDialogOpen(true);
  };

  const closeOfflineDialog = () => {
    setOfflineDialogOpen(false);
  };

  const confirmOfflinePayment = async () => {
    if (!offlinePayment.invoiceId) return;
    try {
      await markInvoicePaidOffline(offlinePayment.invoiceId, {
        paymentMethod: offlinePayment.paymentMethod,
        transactionId: offlinePayment.transactionId,
      });
      await handleAllUserInvoice(id);
      closeOfflineDialog();
    } catch {
      // keep dialog open on error
    }
  };

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
          <SummaryCard title="Total Amount Paid" value={`₹${userInvoices?.totalPaidFormatted}`} bg="#E0F2FE" />
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
                <TableCell>Branch</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {result?.map((val, kye) => (
                <TableRow key={val?._id || kye}>
                  <TableCell>{val?.month}</TableCell>
                  <TableCell sx={{ color: "#2563EB", fontWeight: 500 }}>
                    {val?.InvoiceNo}
                  </TableCell>
                  <TableCell>₹{val?.monthlyPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={val?.PymentType || val?.paymentType || "N/A"}
                      color={
                        (val?.PymentType || val?.paymentType) === "Offline"
                          ? "info"
                          : "primary"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {(val?.PymentType || val?.paymentType) === "Online"
                      ? "Online"
                      : userInvoices?.scheme?.branch?.branchName ||
                        userInvoices?.scheme?.branch ||
                        "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={val?.paymentStatus || "PENDING"}
                      color={
                        val?.paymentStatus === "SUCCESS"
                          ? "success"
                          : val?.paymentStatus === "PENDING"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {canManageOffline &&
                        !accessLoading &&
                        (val?.paymentStatus || "PENDING") !== "SUCCESS" && (
                          <Button
                            onClick={() => openOfflineDialog(val._id)}
                            variant="outlined"
                            size="small"
                            color="success"
                            disabled={markOfflineLoadingId === val._id}
                          >
                            {markOfflineLoadingId === val._id ? (
                              <CircularProgress size={18} />
                            ) : (
                              "Mark Paid (Offline)"
                            )}
                          </Button>
                        )}

                      <Button
                        onClick={async () => {
                          await handleByIdInvoice(val._id);
                          navigate(`/Customers/user/Invoice/${val._id}`);
                        }}
                        variant="contained"
                        size="small"
                        startIcon={<DescriptionIcon />}
                      >
                        {InvoiceDetailLoading === val._id ? (
                          <CircularProgress size={25} />
                        ) : (
                          "Invoice"
                        )}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={offlineDialogOpen} onClose={closeOfflineDialog} fullWidth>
        <DialogTitle>Mark Installment Paid (Offline)</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {selectedInvoice?.month ? `Month: ${selectedInvoice.month}. ` : ""}
            {selectedInvoice?.monthlyPrice
              ? `Amount: ₹${selectedInvoice.monthlyPrice}.`
              : ""}
          </Typography>

          <Stack spacing={2}>
            <TextField
              select
              label="Payment Method"
              value={offlinePayment.paymentMethod}
              onChange={(e) =>
                setOfflinePayment((p) => ({
                  ...p,
                  paymentMethod: e.target.value,
                }))
              }
            >
              {OFFLINE_PAYMENT_METHODS.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Transaction Ref (optional)"
              value={offlinePayment.transactionId}
              onChange={(e) =>
                setOfflinePayment((p) => ({
                  ...p,
                  transactionId: e.target.value,
                }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOfflineDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={confirmOfflinePayment}
            variant="contained"
            color="success"
            disabled={markOfflineLoadingId === offlinePayment.invoiceId}
          >
            {markOfflineLoadingId === offlinePayment.invoiceId ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Confirm Paid"
            )}
          </Button>
        </DialogActions>
      </Dialog>
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
