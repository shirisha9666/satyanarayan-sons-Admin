import {
  Button,
  Pagination,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./TransactionsContext";
import { InputAdornment } from "@material-ui/core";
import { GridSearchIcon } from "@material-ui/data-grid";
import { isAutheticated } from "src/auth";

const Transactions = () => {
  const navigate = useNavigate();
  const user = isAutheticated();

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

  // ✅ TABLE HEADERS
  const tableHeadering = [
    "Name",
    "Phone",
    "Email",
    "Start Date",
    "End Date",
    "MemberShip-No",
    "Paid Months",
    "Pending Months",
    "Next Payment Date",
    "Actions",
  ];

  // ✅ DATA
  let fetchBanner = employeesData?.result || [];

  // ✅ FILTER LOGIC
  if (user?.role === "admin") {
    fetchBanner = fetchBanner.filter((item) =>
      item.goldSchemas?.some(
        (schema) => schema.type === "online" && !schema.branch
      )
    );
  } else {
    fetchBanner = fetchBanner.filter(
      (item) =>
        item.branch?._id === user?.branch?._id &&
        item.customerType !== "NO_GOLD_CUSTOMER"
    );
  }

  // ✅ SEARCH
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);
    handlegetAllData(page, itemPerPage, employeType, value);
  };

  // ✅ CALCULATE MONTHS
  const calculateMonths = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth())
    );
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">

            {/* 🔍 SEARCH */}
            <div className="d-flex justify-content-between mb-3">
              <TextField
                size="small"
                placeholder="Search by Name"
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
                      <td colSpan="9" className="text-center">
                        No Data Available
                      </td>
                    </tr>
                  )}

                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    fetchBanner.map((item) => {
                      const schema = item.goldSchemas?.[0];

                      // ✅ TOTAL MONTHS
                      const totalMonths = calculateMonths(
                        schema?.startDate,
                        schema?.endDate
                      );

                      // ✅ PAID MONTHS (example logic)
                      const paidMonths = schema?.installmentsPaid || 0;

                      // ✅ PENDING MONTHS
                      const pendingMonths = totalMonths - paidMonths;

                      return (
                        <tr key={item._id}>
                          
                          {/* 🔥 CLICKABLE NAME */}
                          <td
                            style={{ color: "#007bff", cursor: "pointer" }}
                            onClick={async () => {
                              await handleUserSchemas(item._id);
                              navigate(`/user-details/${item._id}`);
                            }}
                          >
                            {item.firstname}
                          </td>

                          <td>{item.phone}</td>
                          <td>{item.email}</td>

                          <td>{item.createdAt}</td>
                          <td>{item.endDate}</td>
                          <td>{item.membershipNo}</td>

                          <td>{paidMonths}</td>
                          <td>{pendingMonths >= 0 ? pendingMonths : 0}</td>

                          <td>{schema?.nextPaymentDate || "-"}</td>

                          {/* ACTION */}
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
                      );
                    })
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