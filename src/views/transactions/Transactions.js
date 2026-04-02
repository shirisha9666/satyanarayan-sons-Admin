import {
  Button,
  Box,
  Pagination,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./TransactionsContext";
import { InputAdornment } from "@material-ui/core";
import { GridSearchIcon } from "@material-ui/data-grid";
import { isAutheticated } from "src/auth";

const Transactions = () => {
  const navigate = useNavigate();
  const user = isAutheticated(); // 🔥 logged-in user

  const {
    setPage,
    employeesData,
    handlegetAllData,
    setItemPerPage,
    setSearchByRole,
    employeType,
    itemPerPage,
    viewBannerId,
    loading,
    page,
    setSearchName,
    searchName,
    handleUserSchemas,
  } = useTransactions();

  const tableHeadering = [
    "Start",
    "FirstName",
    "Email",
    "Phone",
    "Customer_Type",
    "Status",
    "Actions",
  ];

  // 🔥 ORIGINAL DATA
  let fetchBanner = employeesData?.result || [];

  // 🔥 FILTER LOGIC (IMPORTANT)
  if (user?.role === "admin") {
    // 👉 ADMIN → show only ONLINE users (branch null)
    fetchBanner = fetchBanner.filter(
      (item) =>
        (!item.branch || item.branch === null) &&
        item.customerType !== "NO_GOLD_CUSTOMER"
    );
  } else {
    // 👉 EMPLOYEE → show only their branch users
    fetchBanner = fetchBanner.filter(
      (item) =>
        item.branch?._id === user?.branch?._id &&
        item.customerType !== "NO_GOLD_CUSTOMER"
    );
  }

  const roles = [
    {
      role: "All",
      sendValue: "",
      bgColor: "#374151",
      textColor: "#FFFFFF",
    },
    {
      role: "Regular_Customers",
      sendValue: "REGULAR_CUSTOMER",
      bgColor: "#1E3A8A",
      textColor: "#FFFFFF",
    },
    {
      role: "Not Taken Schemes",
      sendValue: "NO_GOLD_CUSTOMER",
      bgColor: "#065F46",
      textColor: "#FFFFFF",
    },
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);

    handlegetAllData(page, itemPerPage, employeType, value);
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">

            {/* 🔍 FILTER + SEARCH */}
            <div className="d-flex justify-content-between mb-3">

              {/* FILTER BUTTONS */}
              <div style={{ display: "flex", gap: "12px" }}>
                {roles.map((val) => (
                  <Button
                    key={val.role}
                    onClick={() => {
                      setSearchByRole(val.sendValue);
                      handlegetAllData(
                        page,
                        itemPerPage,
                        val.sendValue,
                        searchName
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
                      borderRadius: "10px",
                      textTransform: "none",
                    }}
                  >
                    {val.role}
                  </Button>
                ))}
              </div>

              {/* SEARCH */}
              <TextField
                size="small"
                placeholder="Search by first Name"
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

            {/* 📊 TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead style={{ background: "#8cd5d5" }}>
                  <tr>
                    {tableHeadering.map((head) => (
                      <th key={head}>{head}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {!loading && fetchBanner.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Data Available
                      </td>
                    </tr>
                  )}

                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    fetchBanner.map((item) => (
                      <tr key={item._id}>
                        <td>{item.createdAt}</td>
                        <td>{item.firstname}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.customerType}</td>
                        <td>{item.status}</td>

                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={async () => {
                              await handleUserSchemas(item._id);
                              navigate(
                                `/Customers/All/user/Schemas/${item.firstname}/${item._id}`
                              );
                            }}
                          >
                            {viewBannerId === item._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              "View"
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 📄 PAGINATION */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                count={employeesData?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllData(
                    value,
                    itemPerPage,
                    employeType,
                    searchName
                  );
                }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;