import {
  Button,
  Box,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBranche } from "./BranchesContext";
import { InputAdornment } from "@material-ui/core";
import { GridSearchIcon } from "@material-ui/data-grid";

const Branches = () => {
  const navigate = useNavigate();
  const {
    banner,
    handlegetAllData,
    setPage,
    setItemPerPage,
    handleDelete,
    setsearchName,
    searchName,
    bannerId,
    itemPerPage,
    viewBannerId,
    loading,
    page,
    setSearchName,
    handleOneBanner,
  } = useBranche();

  const tableHeadings = [
    "Branch Code",
    "Branch Name",
    "State",
    "City",
    "Contact Number",
    "Branch Manager",
    "Address",
    "PIN Code",
    "Actions",
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);

    handlegetAllData(page, itemPerPage, value);
  };
  let fetchBanner = banner?.result;
  console.log("Branch data heare ", searchName);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <div className="row ml-0 mr-0 mb-10">
              <div className="col-sm-12 col-md-12 d-flex justify-content-between align-items-center ">
                <div className="dataTables_length w-50">
                  <label className="w-100">
                    Show
                    <select
                      style={{ width: "10%" }}
                      onChange={(e) => {
                        let val = e.target.value;
                        setItemPerPage(Number(val));
                        handlegetAllData(page, Number(val), searchName);
                      }}
                      className="
                                       select-w
                                       custom-select custom-select-sm
                                       form-control form-control-sm
                                     "
                    >
                      <option value="10">10</option>
                      <option value="2">2</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    entries
                  </label>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textTransform: "capitalize",
                    }}
                    onClick={() => {
                      navigate("/Branches/add");
                    }}
                  >
                    Add
          
                  </Button>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search by Branch Name"
                  autoComplete="off"
                  value={searchName}
                  onChange={handleSearchChange}
                  sx={{
                    width: "280px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GridSearchIcon style={{ color: "#888" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            <div className="table-responsive table-shoot mt-3">
              <table
                className="table table-centered table-nowrap"
                style={{ border: "1px solid" }}
              >
                <thead
                  className="thead-info"
                  style={{ background: "rgb(140, 213, 213)" }}
                >
                  <tr>
                    {tableHeadings.map((head) => (
                      <th className={head === "Actions" ? "text-center" : ""}>
                        {" "}
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!loading && fetchBanner?.length === 0 && (
                    <tr className="text-center">
                      <td colSpan="6">
                        <h5>No Data Available</h5>
                      </td>
                    </tr>
                  )}
                  {loading ? (
                    <tr>
                      <td className="text-center" colSpan="6">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    fetchBanner &&
                    fetchBanner.map((item, i) => (
                      <tr key={i}>
                        {/* <td>{item?.createdAt}</td> */}
                        <td>{item?.branchCode}</td>
                        <td>{item?.branchName || null}</td>

                        <td>{item?.state}</td>
                        <td>{item?.city}</td>
                        <td>{item?.contactNumber}</td>
                        <td>{item?.managerId?.name}</td>

                        <td>{item?.address}</td>
                        <td>{item?.pincode}</td>

                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              style={{
                                color: "white",
                                backgroundColor: "#2F3E46",
                              }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={() =>
                                navigate(`/Branches/manager/create/${item._id}`)
                              }
                            >
                              Manager
                            </button>
                            <button
                              style={{ color: "white" }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={async () => {
                                await handleOneBanner(item._id);
                                navigate(
                                  `/Branches/update/${item._id}`
                                );
                              }}
                            >
                              {viewBannerId === item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "Edit"
                              )}
                            </button>
                            <button
                              style={{ color: "white", background: "red" }}
                              type="button"
                              className="btn btn-sm waves-effect waves-light btn-table"
                              onClick={() => handleDelete(item._id)}
                            >
                              {bannerId === item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* 
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Pagination
                count={banner?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllData(value, itemPerPage, searchName);
                }}
                color="primary"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Branches;
