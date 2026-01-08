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
import { useTransactions } from "./TransactionsContext";
import { useBranche } from "../Branches/BranchesContext";
import { InputAdornment } from "@material-ui/core";
import { GridSearchIcon } from "@material-ui/data-grid";

const Transactions = () => {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState("");
  const {
    setPage,
    employeesData,
    handlegetAllData,

    setItemPerPage,
    handleDelete,
    setEmployeType,
    employeType,
    bannerId,
    itemPerPage,
    viewBannerId,
    delId,
    loading,
    page,
    searchByRole,
    setSearchByRole,
    handleUserSchemas,
  } = useTransactions();

  console.log("searchByRole", searchByRole);
  const tableHeadering = [
    "Start",
    "FirstName",
    "Email",
    "Phone",
    "Customer_Type",
    "Status",
    "Actions",
  ];

  let fetchBanner = employeesData?.result;
  const roles = [
    {
      role: "All",
      sendValue: "",
      bgColor: "#374151", // slate gray
      textColor: "#FFFFFF",
    },
    {
      role: "Regular_Customers",
      sendValue: "REGULAR_CUSTOMER",
      bgColor: "#1E3A8A", // deep blue
      textColor: "#FFFFFF",
    },
    {
      role: "Not Taken Schemes",
      sendValue: "NO_GOLD_CUSTOMER",
      bgColor: "#065F46", // emerald green
      textColor: "#FFFFFF",
    },
  ];
  console.log("fetchBanner transactions", fetchBanner);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setEmployeType(value);

    handlegetAllData(page, itemPerPage, value);
  };

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
                        handlegetAllData(page, Number(val), employeType);
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
              </div>
              <div className="d-flex justify-content-between">
                <div
                  style={{ display: "flex", gap: "12px", marginTop: "10px" }}
                >
                  {roles.map((val) => (
                    <Button
                      onClick={() => {
                        setSearchByRole(val.sendValue);

                        handlegetAllData(page, itemPerPage, val.sendValue);
                      }}
                      variant="contained"
                      style={{
                        background:
                          employeType === val.sendValue
                            ? "#D4AF37"
                            : val.bgColor,
                        color:
                          employeType === val.sendValue
                            ? "#1B1A1A"
                            : val.textColor,
                        fontWeight: "bold",
                        padding: "8px 20px",
                        borderRadius: "10px",
                        textTransform: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {val.role}
                    </Button>
                  ))}
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
                    placeholder="Search by Name or Id"
                    autoComplete="off"
                    value={employeType}
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
                    {tableHeadering.map((head) => (
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
                        {/* Employee ID */}
                        <td>{item?.createdAt}</td>

                        {/* Role */}
                        <td>{item?.firstname}</td>

                        {/* Name */}
                        {/* <td>{item?.name || "-"}</td> */}

                        {/* Phone */}
                        <td>{item?.email}</td>

                        {/* Access */}

                        {/* Gold Schemes Added */}
                        <td>{item?.phone}</td>
                        <td>{item?.customerType}</td>
                        {/* Status */}
                        <td>{item?.status}</td>

                        {/* Actions */}
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
                              disabled={
                                item?.customerType === "NO_GOLD_CUSTOMER"
                              }
                              style={{
                                color: "white",
                                backgroundColor: "#3f51b5",
                              }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={async () => {
                                setActiveBtn("View");
                                // await handleUserSchemas(item._id);

                                navigate(`/Transactions/All/user/Schemas/${item._id}`);
                              }}
                            >
                              {viewBannerId ===item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "View"
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

            <div style={{ display: "flex", justifyContent: "right" }}>
              <Pagination
                count={employeesData?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllData(value, itemPerPage, employeType);
                }}
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Transactions;
