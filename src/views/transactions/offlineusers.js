import {
  Box,
  Card,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { isAutheticated } from "../../auth";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

export default function OfflineUsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [branchesById, setBranchesById] = useState({});

  const navigate = useNavigate();

  const apiBase = "https://satyanaran-sons-api.onrender.com";

  // ✅ GET API
  const fetchOfflineUsers = async () => {
    try {
      setLoading(true);
      const token = isAutheticated();
      const res = await axios.get(`${apiBase}/api/gold/scheme/offline/users`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = res?.data;
      const list = Array.isArray(payload) ? payload : payload?.result || [];
      setData(list);
    } catch (err) {
      if (err?.response?.status === 404) {
        setData([]);
        return;
      }
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const token = isAutheticated();
      const res = await axios.get(
        `${apiBase}/api/branch/getAll?page=1&limit=500`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      const list = res?.data?.result || [];
      const map = {};
      for (const branch of list) {
        if (branch?._id) {
          map[branch._id] = branch?.branchName || branch?.name || branch._id;
        }
      }
      setBranchesById(map);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOfflineUsers();
    fetchBranches();
  }, []);

  // ✅ PATCH API
  const handleStatusUpdate = async (status) => {
    try {
      setActionLoading(true);

      const token = isAutheticated();
      await axios.patch(
        `${apiBase}/api/gold/scheme/status/${selectedId}`,
        {
          status: status,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      setOpenDialog(false);
      fetchOfflineUsers();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (val) => {
    const s = val?.paymentStatus || val?.status || "";
    if (s === "SUCCESS" || s === "ACTIVE" || s === "Approved") return "success";
    if (["FAILED", "CANCELLED", "Rejected"].includes(s)) return "error";
    return "warning";
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const avatarColors = [
    "#E67E22", "#8E44AD", "#2980B9", "#27AE60", "#C0392B",
    "#16A085", "#D35400", "#2C3E50",
  ];

  const getAvatarColor = (name = "") => {
    let hash = 0;
    for (let c of name) hash += c.charCodeAt(0);
    return avatarColors[hash % avatarColors.length];
  };

  const columns = [
    "Member", "Receipt No", "Invoice", "Amount", "Payment Type", "Branch", "Status", ""
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        background: "#F7F8FC",
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
          }}
        >
          <AccountBalanceWalletOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.35rem",
              color: "#1A1D23",
              lineHeight: 1.2,
            }}
          >
            Offline Payment Verification
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#8A8FA3", mt: 0.2 }}>
            Review and approve member payment receipts
          </Typography>
        </Box>
      </Box>

      {/* ── Table Card ── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #E8EAF0",
          overflow: "hidden",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <TableContainer component={Paper} elevation={0} sx={{ background: "#fff" }}>
          <Table>
            {/* Head */}
            <TableHead>
              <TableRow sx={{ background: "#F9FAFB" }}>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    align={col === "" ? "right" : "left"}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      color: "#6B7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      py: 1.8,
                      borderBottom: "2px solid #F0F1F5",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                      <CircularProgress size={32} thickness={4} style={{ color: "#F59E0B" }} />
                      <Typography sx={{ color: "#9CA3AF", fontSize: "0.85rem" }}>
                        Loading records...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 7 }}>
                    <ReceiptLongIcon sx={{ fontSize: 40, color: "#D1D5DB", mb: 1 }} />
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                      No offline payments found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                (Array.isArray(data) ? data : []).map((val, idx) => {
                  const name = val?.SchemaId?.name || val?.name || "N/A";
                  return (
                    <TableRow
                      key={val._id}
                      sx={{
                        "&:hover": { background: "#FAFBFF" },
                        transition: "background 0.15s",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      {/* Member */}
                      <TableCell sx={{ py: 1.8 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: getAvatarColor(name),
                              borderRadius: "10px",
                            }}
                          >
                            {getInitials(name)}
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#1A1D23" }}>
                            {name}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Branch */}
                     <TableCell>
                        <Typography
                          sx={{
                            fontSize: "0.82rem",
                            color: "#6B7280",
                            fontFamily: "monospace",
                            background: "#F3F4F6",
                            px: 1,
                            py: 0.3,
                            borderRadius: "6px",
                            display: "inline-block",
                          }}
                        >
                          {val?.ReceipmentNumber ||
                            val?.receiptNo ||
                            val?.reciptNo ||
                            "—"}
                        </Typography>
                      </TableCell>

                      {/* Invoice */}
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<DescriptionIcon sx={{ fontSize: "15px !important" }} />}
                          onClick={() => navigate(`/Customers/user/Invoice/${val._id}`)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.82rem",
                            color: "#2563EB",
                            background: "#EFF6FF",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.5,
                            minWidth: 0,
                            "&:hover": { background: "#DBEAFE" },
                          }}
                        >
                          {val?.InvoiceNo || "Invoice"}
                        </Button>
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#1A1D23" }}>
                          ₹{val?.monthlyPrice}
                        </Typography>
                      </TableCell>

                      {/* Payment Type */}
                      <TableCell>
                        <Typography sx={{ fontSize: "0.85rem", color: "#4B5563" }}>
                          {val?.PymentType || val?.paymentType || "Offline"}
                          {val?.paymentMethod ? (
                            <Box
                              component="span"
                              sx={{ color: "#9CA3AF", fontSize: "0.78rem", ml: 0.5 }}
                            >
                              ({val.paymentMethod})
                            </Box>
                          ) : null}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.85rem", color: "#4B5563" }}>
                          {typeof val?.SchemaId?.branch === "object"
                            ? val?.SchemaId?.branch?.branchName || "N/A"
                            : branchesById?.[val?.SchemaId?.branch] ||
                              val?.SchemaId?.branch ||
                              "N/A"}
                        </Typography>
                      </TableCell>

                      {/* Receipt No */}
                      

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={val?.paymentStatus || val?.status || "PENDING"}
                          color={getStatusColor(val)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            borderRadius: "8px",
                            letterSpacing: "0.03em",
                          }}
                        />
                      </TableCell>

                      {/* Action */}
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VerifiedUserOutlinedIcon sx={{ fontSize: "15px !important" }} />}
                          onClick={() => {
                            setSelectedId(val._id);
                            setSelectedData(val);
                            setOpenDialog(true);
                          }}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.82rem",
                            borderRadius: "9px",
                            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                            boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
                            px: 2,
                            "&:hover": {
                              background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                              boxShadow: "0 4px 12px rgba(245,158,11,0.4)",
                            },
                          }}
                        >
                          Verify
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ✅ POPUP */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "20px",
            p: 0,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Dialog Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <VerifiedUserOutlinedIcon sx={{ color: "#fff", fontSize: 24 }} />
          <DialogTitle
            sx={{
              p: 0,
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#fff",
            }}
          >
            Verify Payment
          </DialogTitle>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Typography
            sx={{ color: "#6B7280", fontSize: "0.875rem", mb: 2.5 }}
          >
            Review the details below and approve or reject this payment.
          </Typography>

          {/* Detail rows */}
          {[
            {
              label: "Member Name",
              value: selectedData?.SchemaId?.name || selectedData?.name || "N/A",
            },
            {
              label: "Branch",
              value:
                typeof selectedData?.SchemaId?.branch === "object"
                  ? selectedData?.SchemaId?.branch?.branchName || "N/A"
                  : branchesById?.[selectedData?.SchemaId?.branch] ||
                    selectedData?.SchemaId?.branch ||
                    "N/A",
            },
            {
              label: "Invoice No",
              value: selectedData?.InvoiceNo || "N/A",
            },
            {
              label: "Receipt No",
              value:
                selectedData?.ReceipmentNumber ||
                selectedData?.receiptNo ||
                selectedData?.reciptNo ||
                "N/A",
              mono: true,
            },
          ].map(({ label, value, mono }) => (
            <Box
              key={label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.4,
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "#9CA3AF", fontWeight: 500 }}>
                {label}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#1A1D23",
                  fontFamily: mono ? "monospace" : "inherit",
                  background: mono ? "#F3F4F6" : "transparent",
                  px: mono ? 1 : 0,
                  py: mono ? 0.3 : 0,
                  borderRadius: mono ? "6px" : 0,
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}

          {/* ✅ IMAGE */}
          {selectedData?.ReceiptUpload?.url && (
            <Box
              sx={{
                mt: 2.5,
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #F0F1F5",
              }}
            >
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  background: "#F9FAFB",
                  borderBottom: "1px solid #F0F1F5",
                }}
              >
                Receipt Image
              </Typography>
              <img
                src={selectedData.ReceiptUpload.url}
                alt="Receipt"
                style={{
                  width: "100%",
                  display: "block",
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            gap: 1.5,
            borderTop: "1px solid #F3F4F6",
            background: "#FAFBFC",
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#6B7280",
              borderRadius: "10px",
              px: 2.5,
              "&:hover": { background: "#F3F4F6" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => handleStatusUpdate("Rejected")}
            color="error"
            variant="outlined"
            disabled={actionLoading}
            startIcon={<CancelOutlinedIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              px: 2.5,
              borderWidth: "1.5px",
              "&:hover": { borderWidth: "1.5px", background: "#FEF2F2" },
            }}
          >
            Reject
          </Button>

          <Button
            onClick={() => handleStatusUpdate("Approved")}
            variant="contained"
            disabled={actionLoading}
            startIcon={!actionLoading && <CheckCircleOutlineIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              px: 2.5,
              background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              boxShadow: "0 2px 8px rgba(34,197,94,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)",
                boxShadow: "0 4px 12px rgba(34,197,94,0.4)",
              },
            }}
          >
            {actionLoading ? <CircularProgress size={18} style={{ color: "#fff" }} /> : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}