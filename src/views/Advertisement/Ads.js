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
import { useAds } from "./AdContext";
import { Pagination } from "@mui/material";

const Advertisement = () => {
  const {
    handeAllAds,
    allads,
    handleDeleteByIdAd,
    allAdsLoading,
    addIdloading,
    handlegetByIdAd,
    planDeleteLoading,
    localAddId,
  } = useAds();

  const tableHeading = [
    "Advertisement",

    "",

  ];
  const navigate = useNavigate();
  const ads = allads?.getpackages;

  const handlePageChange = (newPage) => {
    handeAllAds(newPage);
  };
  console.log("AllAds", allads)

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
          Advertisement
        </Typography>

        {/* <Box>
          <Button
            variant="contained"
            color="primary"
            style={{ fontWeight: "600" }}
            onClick={() => navigate("/Advertisement/add")}
          >
            Add Advertisement
          </Button>
        </Box> */}
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              {tableHeading.map((item) => (
                <TableCell
                  align="start"
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
            {allAdsLoading ? (
              <Box sx={{ textAlign: "center", paddingTop: "3rem" }}>
                <CircularProgress />
              </Box>
            ) : ads?.length > 0 ? (
              ads?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="start">
                    <img src={item?.AdPoster?.fileUrl} style={{ height: "2.2rem", width: "3rem", borderRadius: "5px" }} />
                  </TableCell>

                  <TableCell align="end" sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                    <Button
                      variant="contained"
                      onClick={async () => {
                        localStorage.setItem("localAddId", item._id);
                        await handlegetByIdAd(item._id);
                        navigate(`/Advertisement/update/${item._id}`);
                      }}
                      style={{
                        background: "purple",
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      {addIdloading === item._id ? (
                        <CircularProgress size={25} />
                      ) : (
                        "Update"
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDeleteByIdAd(item._id)}
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
                  {/* <TableCell align="start">
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
                  </TableCell> */}
                  {/* <TableCell align="start">
                   
                  </TableCell> */}
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
            count={allads.totalPages}
            page={allads.currentPage}
            onChange={(e, value) => handlePageChange(value)}
          />
        </Table>
      </TableContainer>
    </div>
  );
};

export default Advertisement;
