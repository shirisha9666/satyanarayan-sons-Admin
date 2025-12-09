import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { usePlan } from "./PlanContext";
import { Pagination } from "@mui/material";

const Plans = () => {
  const {
    handeAllPlans,
    AllPlans,
    handleDeleteByIdplan,
    allPlansLoading,
    planIdloading,
    handlegetByIdplan,
    planDeleteLoading,
    localPlanId,
  } = usePlan();

  const tableHeading = [
    "Plan Name",
    "Price",
    "GST",
    "Total Price",
    "Duration",

    "Created",
    "Updated",
    "",
    "",
    "",
  ];
  const navigate = useNavigate();
  const plans = AllPlans?.getpackages;
  const handlePageChange = (newPage) => {
    handeAllPlans(newPage);
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <Typography style={{ fontSize: "1.5rem", fontWeight: "600" }}>
          Plans
        </Typography>
        {/* 
        <Box>
          <Button
            variant="contained"
            color="primary"
            style={{ fontWeight: "600" }}
            onClick={() => navigate("/plans/Add")}
          >
            Add Plan
          </Button>
        </Box> */}
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              {tableHeading.map((item) => (
                <TableCell
                  align="center"
                  sx={{
                    background: "orange",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allPlansLoading ? (
              <Box sx={{ textAlign: "center", paddingTop: "3rem" }}>
                <CircularProgress />
              </Box>
            ) : plans?.length > 0 ? (
              plans?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.Plan}</TableCell>
                  <TableCell align="center">₹{item.Price}</TableCell>
                  <TableCell align="center">{item.Gst.Gst}%</TableCell>

                  <TableCell align="center">₹{item.Total_Price}</TableCell>
                  <TableCell align="center">{item.Duration}</TableCell>

                  <TableCell align="center">{item.createdAt}</TableCell>
                  <TableCell align="center">{item.updatedAt}</TableCell>
                  <TableCell align="start">
                    <Button
                      variant="contained"
                      onClick={async () => {
                        localStorage.setItem("localPlanId", item._id);
                        await handlegetByIdplan(item._id);
                        navigate(`/plans/update/${item._id}`);
                      }}
                      style={{
                        background: "purple",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      {planIdloading === item._id ? (
                        <CircularProgress size={25} />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </TableCell>
                  <TableCell align="start">
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/plans/view/${item._id}`)}
                      style={{
                        background: "green",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="start">
                    <Button
                      onClick={() => handleDeleteByIdplan(item._id)}
                      variant="contained"
                      style={{
                        background: "red",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      {planDeleteLoading === item._id ? (
                        <CircularProgress slot={25} />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Typography
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  textAlign: "center",
                  padding: "1rem",
                }}
              >
                No Data Available
              </Typography>
            )}
          </TableBody>
          <Pagination
            color="primary"
            count={AllPlans.totalPages}
            page={AllPlans.currentPage}
            onChange={(e, value) => handlePageChange(value)}
          />
        </Table>
      </TableContainer>
    </div>
  );
};

export default Plans;
