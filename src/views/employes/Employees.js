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
import { useEmployees } from "./EmployeesContext";
import { useBranche } from "../Branches/BranchesContext";
import { InputAdornment } from "@material-ui/core";
import { GridSearchIcon } from "@material-ui/data-grid";

const Employees = () => {
  const navigate = useNavigate();
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
  } = useEmployees();

  console.log("searchByRole", searchByRole);
  const tableHeadering = [
    "Employee_ID",
    "Role",
    "Name",

    "Branch",
    "Access",
    "Status",
    "Gold_Count",
    // "Last Login",
    "Start",
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
      role: "Branch Manager",
      sendValue: "branch_manager",
      bgColor: "#1E3A8A", // deep blue
      textColor: "#FFFFFF",
    },
    {
      role: "Account Manager",
      sendValue: "account_manager",
      bgColor: "#065F46", // emerald green
      textColor: "#FFFFFF",
    },
    {
      role: "Content Manager",
      sendValue: "content_manager",
      bgColor: "#7C2D12", // dark orange / rust
      textColor: "#FFFFFF",
    },
    {
      role: "Employee",
      sendValue: "employee",
      bgColor: "#4B5563", // cool gray
      textColor: "#FFFFFF",
    },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setEmployeType(value);

    handlegetAllData(page, itemPerPage, value, searchByRole);
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
                        handlegetAllData(
                          page,
                          Number(val),
                          employeType,
                          searchByRole
                        );
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
                      navigate("/add-employee");
                    }}
                  >
                    Add
                  </Button>
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

                        handlegetAllData(
                          page,
                          itemPerPage,
                          employeType,
                          val.sendValue
                        );
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
                        <td>{item?.employeId}</td>

                        {/* Role */}
                        <td>{item?.role}</td>

                        {/* Name */}
                        <td>{item?.name || "-"}</td>

                        {/* Phone */}
                        <td>{item?.branchId?.branchName}</td>

                        {/* Access */}
                        <td>
                          {item?.access?.length
                            ? item.access.map((acc, index) => (
                                <span
                                  key={index}
                                  className="badge bg-primary me-1"
                                >
                                  {acc}
                                </span>
                              ))
                            : "-"}
                        </td>

                        {/* Status */}
                        <td>{item?.isActive}</td>

                        {/* Gold Schemes Added */}
                        <td>{item?.goldSchemeCount ?? 0}</td>

                        {/* Last Login */}
                        {/* <td>{item?.lastLogin || "-"}</td> */}

                        {/* Created At */}
                        <td>{item?.createdAt}</td>

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
                              style={{ color: "white" }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={() => {
                                navigate(`/employee/update/${item._id}`);
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
                              {delId === item._id ? (
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

            <div style={{ display: "flex", justifyContent: "right" }}>
              <Pagination
                count={employeesData?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllData(
                    value,
                    itemPerPage,
                    employeType,
                    searchByRole
                  );
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
export default Employees;
