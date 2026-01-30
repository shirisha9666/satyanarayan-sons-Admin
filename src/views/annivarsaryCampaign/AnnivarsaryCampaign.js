import React, { useState } from "react";
import { Button, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { isAutheticated } from "src/auth";
import toast from "react-hot-toast";
import { Typography } from "@material-ui/core";

const Anniversary = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);
      setError(false);

      // 🔗 Call your backend API (change URL if needed)
      const res = await axios.post(
        "/api/anniversary/add",
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("res", res.response);

      setSuccess(true);
      toast.success("message sent all users successfully");
    } catch (err) {
      setError(true);
      console.log("erorr", error);
    } finally {
      setLoading(false);
    }
  };

  return (
   <Box
  display="flex"
  justifyContent="center"
  mt={6}
>
  <Box
    sx={{
      p: 4,
      width: 480,
      borderRadius: 3,
      background: "linear-gradient(135deg, #fff7ed, #fffbf5)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      textAlign: "center",
    }}
  >
    {/* Title */}
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: "#92400e",
        mb: 1,
      }}
    >
      🎉 Anniversary Campaign
    </Typography>

    {/* Subtitle */}
    <Typography
      sx={{
        color: "#78350f",
        fontSize: 15,
        mb: 4,
      }}
    >
      Send anniversary wishes to all eligible users with one click
    </Typography>

    {/* Action Button */}
    <Button
      variant="contained"
      onClick={handleSend}
      disabled={loading}
      sx={{
        minWidth: 260,
        py: 1.5,
        fontSize: 16,
        fontWeight: 600,
        borderRadius: 2,
        background:
          "linear-gradient(135deg, #f59e0b, #d97706)",
        boxShadow: "0 8px 20px rgba(245, 158, 11, 0.4)",
        "&:hover": {
          background:
            "linear-gradient(135deg, #d97706, #b45309)",
        },
      }}
    >
      {loading ? (
        <>
          <CircularProgress
            size={22}
            sx={{ mr: 1, color: "white" }}
          />
          Sending Messages...
        </>
      ) : (
        "Send Message to All Users"
      )}
    </Button>

    {/* Success Snackbar */}
    <Snackbar
      open={success}
      autoHideDuration={3000}
      onClose={() => setSuccess(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="success" variant="filled">
        🎉 Messages sent successfully
      </Alert>
    </Snackbar>

    {/* Error Snackbar */}
    <Snackbar
      open={error}
      autoHideDuration={3000}
      onClose={() => setError(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="error" variant="filled">
        ❌ Failed to send messages
      </Alert>
    </Snackbar>
  </Box>
</Box>

  );
};

export default Anniversary;
