import {
  Box,
  Card,
  Collapse,
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
import { useEffect, useMemo, useState } from "react";
import { CircularProgress, Grid } from "@material-ui/core";

//  Status Color Handler
const statusColor = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "ACTIVE":
      return "success";
    case "SUCCESS":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "error";
    default:
      return "default";
  }
};

export default function UserAllSchemesTable() {
  const navigate = useNavigate();
  const { name, id } = useParams();

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

  const {
    usergoldScheme,
    handleUserSchemas,
    handleAllUserInvoice,
    invoiceTableLoading,
    userInvoices,
  } = useTransactions();

  const rows = usergoldScheme?.findAllPlans || [];

  useEffect(() => {
    if (!id) return;
    handleUserSchemas(id);
  }, [id, handleUserSchemas]);

  const [expandedSchemeId, setExpandedSchemeId] = useState(null);
  const [autoExpanded, setAutoExpanded] = useState(false);

  const expandedDetails = useMemo(() => {
    if (!expandedSchemeId) return null;
    if (String(userInvoices?.scheme?._id || "") !== String(expandedSchemeId)) {
      return null;
    }
    return userInvoices;
  }, [expandedSchemeId, userInvoices]);

  const firstSchemeId = rows?.[0]?._id || null;

  useEffect(() => {
    setExpandedSchemeId(null);
    setAutoExpanded(false);
  }, [id]);

  useEffect(() => {
    if (autoExpanded) return;
    if (!firstSchemeId) return;

    setExpandedSchemeId(firstSchemeId);
    handleAllUserInvoice(firstSchemeId);
    setAutoExpanded(true);
  }, [autoExpanded, firstSchemeId, handleAllUserInvoice]);

  const toggleDetails = async (schemeId) => {
    if (!schemeId) return;

    if (String(expandedSchemeId) === String(schemeId)) {
      setExpandedSchemeId(null);
      return;
    }

    setExpandedSchemeId(schemeId);
    await handleAllUserInvoice(schemeId);
  };

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
            {rows.map((row, index) => {
              const schemeId = row?._id || index;
              const isExpanded = String(expandedSchemeId) === String(row?._id);
              const isLoading = invoiceTableLoading === row?._id;
              const details = isExpanded ? expandedDetails : null;

              const totalMonths = Number(details?.totalMonths || 0);
              const remainingMonths = Number(details?.reminingMonths || 0);
              const paidMonths =
                totalMonths && Number.isFinite(remainingMonths)
                  ? Math.max(totalMonths - remainingMonths, 0)
                  : 0;

              return [
                <TableRow key={`${schemeId}-row`}>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {row?.Scheme_ID?.Scheme_Name}
                    </Typography>
                  </TableCell>
                  <TableCell>{row?.Scheme_ID?.Total_Amount}</TableCell>
                  <TableCell>{row?.Scheme_ID?.Monthly_Installment}</TableCell>
                  <TableCell>{row?.dateOfJoining}</TableCell>
                  <TableCell>{row?.dateOfCompletion}</TableCell>
                  <TableCell>{row?.branch?.branchName || "-"}</TableCell>
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
                      onClick={() => toggleDetails(row?._id)}
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                    >
                      {isLoading ? (
                        <CircularProgress size={22} />
                      ) : isExpanded ? (
                        "Hide"
                      ) : (
                        "View"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>,
                <TableRow key={`${schemeId}-details`}>
                  <TableCell colSpan={tableHeading.length} sx={{ p: 0 }}>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2, backgroundColor: "#fafafa" }}>
                        {isLoading && (
                          <Box sx={{ py: 3, textAlign: "center" }}>
                            <CircularProgress size={26} />
                          </Box>
                        )}

                        {!isLoading && details && (
                          <>
                            <Grid
                              container
                              spacing={2}
                              style={{ marginBottom: "12px" }}
                            >
                              <Grid item xs={12} md={3}>
                                <Card style={{ padding: "16px" }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Total Scheme Amount
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: 700 }}
                                  >
                                    {details?.totalAmount || "-"}
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Card style={{ padding: "16px" }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Total Paid
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: 700 }}
                                  >
                                   {details?.totalPaidFormatted || "-"}
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Card style={{ padding: "16px" }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Paid / Pending Months
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: 700 }}
                                  >
                                    {paidMonths} / {details?.reminingMonths ?? "-"}
                                  </Typography>
                                </Card>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Card style={{ padding: "16px" }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Last Payment Date
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    style={{ fontWeight: 700 }}
                                  >
                                    {details?.lastPaymentDate || "-"}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    style={{ marginTop: "10px" }}
                                  >
                                    Next Payment Date
                                  </Typography>
                                  <Typography
                                    variant="subtitle1"
                                    style={{ fontWeight: 700 }}
                                  >
                                    {details?.nextPaymentDate || "-"}
                                  </Typography>
                                </Card>
                              </Grid>
                            </Grid>

                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                                    <TableCell>Month</TableCell>
                                    <TableCell>Invoice No</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {details?.invoiceData?.map((inv) => (
                                    <TableRow key={inv?._id}>
                                      <TableCell>{inv?.month || "-"}</TableCell>
                                      <TableCell
                                        sx={{ fontWeight: 600, color: "#2563EB" }}
                                      >
                                        {inv?.InvoiceNo || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {inv?.monthlyPrice || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {inv?.PymentType ||
                                          inv?.paymentSource ||
                                          "-"}
                                      </TableCell>
                                      <TableCell>
                                        <Chip
                                          label={inv?.paymentStatus || "PENDING"}
                                          size="small"
                                          color={statusColor(inv?.paymentStatus)}
                                        />
                                      </TableCell>
                                      <TableCell align="right">
                                        <Button
                                          variant="outlined"
                                          size="small"
                                          onClick={() =>
                                            navigate(
                                              `/Customers/user/Invoice/${inv?._id}`,
                                            )
                                          }
                                        >
                                          Invoice
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        )}

                        {!isLoading && isExpanded && !details && (
                          <Typography variant="body2" color="text.secondary">
                            No details available.
                          </Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>,
              ];
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
