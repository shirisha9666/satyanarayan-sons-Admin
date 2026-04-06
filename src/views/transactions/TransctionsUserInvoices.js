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
  const { membershipNo, id } = useParams();
  const schemeKey = membershipNo || id;
  const navigate = useNavigate();

  const {
    userInvoices,
    handleAllUserInvoice,
    invoiceTableLoading,
    InvoiceDetailLoading,
    handleByIdInvoice,
    markInvoicePaidOffline,
    markOfflineLoadingId,
    accessData,
    accessLoading,
  } = useTransactions();

  const role = normalizeRole(accessData?.role);
  const canManageOffline = role === "branch_manager" || role === "employee";

  const [requestedKey, setRequestedKey] = useState(null);

  useEffect(() => {
    if (!schemeKey) return;
    setRequestedKey(schemeKey);
    handleAllUserInvoice(schemeKey);
  }, [schemeKey]);

  const scheme = userInvoices?.scheme || null;
  const plan = scheme?.Scheme_ID || null;

  const schemeType = String(scheme?.type || scheme?.online || "")
    .trim()
    .toLowerCase();
  const branchName =
    schemeType === "online"
      ? "Online"
      : scheme?.branch?.branchName || scheme?.branch || "-";

  const totalMonths = Number(userInvoices?.totalMonths || plan?.Months || 0);
  const pendingMonths = Number(userInvoices?.reminingMonths ?? 0);
  const paidMonths =
    totalMonths && Number.isFinite(pendingMonths)
      ? Math.max(totalMonths - pendingMonths, 0)
      : 0;

  const invoices = userInvoices?.invoiceData || [];

  const hasMatchingData =
    !schemeKey ||
    String(scheme?._id || "") === String(schemeKey) ||
    String(scheme?.membershipNo || "").toLowerCase() ===
      String(schemeKey).toLowerCase();

  const hasRequested = requestedKey === schemeKey;
  const isLoading = !hasRequested || invoiceTableLoading === schemeKey;
  const showNotFound = hasRequested && !isLoading && schemeKey && !hasMatchingData;

  const [offlineDialogOpen, setOfflineDialogOpen] = useState(false);
  const [offlinePayment, setOfflinePayment] = useState({
    invoiceId: null,
    paymentMethod: "CASH",
    transactionId: "",
  });

  const selectedInvoice = useMemo(() => {
    if (!offlinePayment.invoiceId) return null;
    return invoices?.find(
      (r) => String(r?._id) === String(offlinePayment.invoiceId),
    );
  }, [offlinePayment.invoiceId, invoices]);

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
      if (schemeKey) await handleAllUserInvoice(schemeKey);
      closeOfflineDialog();
    } catch {
      // keep dialog open on error
    }
  };

  return (
    <Box p={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight={700}>
          Scheme Details
        </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress size={34} />
        </Box>
      ) : showNotFound ? (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={1}>
              No scheme details found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please check the membership number and try again.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                Scheme
              </Typography>
              <Grid container spacing={2}>
                <DetailItem label="Scheme Name" value={plan?.Scheme_Name || "-"} />
                <DetailItem
                  label="Total Amount"
                  value={
                    userInvoices?.totalAmount
                      ? `₹${userInvoices.totalAmount}`
                      : plan?.Total_Amount != null
                        ? `₹${Number(plan.Total_Amount).toLocaleString("en-IN")}`
                        : "-"
                  }
                />
                <DetailItem
                  label="Monthly Installment"
                  value={
                    plan?.Monthly_Installment != null
                      ? `₹${Number(plan.Monthly_Installment).toLocaleString("en-IN")}`
                      : "-"
                  }
                />
                <DetailItem label="Joining Date" value={scheme?.dateOfJoining || "-"} />
                <DetailItem
                  label="Completion Date"
                  value={scheme?.dateOfCompletion || "-"}
                />
                <DetailItem label="Branch" value={branchName} />
                <DetailItem
                  label="Membership No"
                  value={scheme?.membershipNo || membershipNo || "-"}
                />
                <DetailItem label="Status" value={scheme?.status || "-"} />
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            Payment Summary
          </Typography>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Total Paid Amount"
                value={
                  userInvoices?.totalPaidFormatted
                    ? `₹${userInvoices.totalPaidFormatted}`
                    : "₹0"
                }
                bg="#E0F2FE"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Total Scheme Amount"
                value={userInvoices?.totalAmount ? `₹${userInvoices.totalAmount}` : "-"}
                bg="#EEF2FF"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <SummaryCard title="Paid Months" value={`${paidMonths}`} bg="#DCFCE7" />
            </Grid>
            <Grid item xs={12} md={2}>
              <SummaryCard
                title="Pending Months"
                value={`${Number.isFinite(pendingMonths) ? pendingMonths : 0}`}
                bg="#FFF7ED"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Last Payment Date"
                value={userInvoices?.lastPaymentDate || "-"}
                bg="#F1F5F9"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryCard
                title="Next Payment Date"
                value={userInvoices?.nextPaymentDate || "-"}
                bg="#F1F5F9"
              />
            </Grid>
          </Grid>

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
              Invoice Details
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {invoices?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((val, key) => (
                      <TableRow key={val?._id || key}>
                        <TableCell>{val?.month || "-"}</TableCell>
                        <TableCell sx={{ color: "#2563EB", fontWeight: 600 }}>
                          {val?.InvoiceNo || "-"}
                        </TableCell>
                        <TableCell>₹{val?.monthlyPrice || "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              val?.PymentType ||
                              val?.paymentType ||
                              val?.paymentSource ||
                              "N/A"
                            }
                            color={(() => {
                              const v = String(
                                val?.PymentType ||
                                  val?.paymentType ||
                                  val?.paymentSource ||
                                  "",
                              ).toLowerCase();
                              return v.includes("offline") ? "info" : "primary";
                            })()}
                            size="small"
                          />
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
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="flex-end"
                          >
                            {canManageOffline &&
                              !accessLoading &&
                              (val?.paymentStatus || "PENDING") !==
                                "SUCCESS" && (
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
                                "View Invoice"
                              )}
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

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

function DetailItem({ label, value }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight={700}>
        {value}
      </Typography>
    </Grid>
  );
}
