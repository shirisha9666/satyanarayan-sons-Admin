import {
  Pagination,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "./TransactionsContext";
import { InputAdornment } from "@material-ui/core";
import { GridSearchIcon } from "@material-ui/data-grid";

const Transactions = () => {
  const navigate = useNavigate();

  const {
    setPage,
    employeesData,
    handlegetAllData,
    employeType,
    itemPerPage,
    loading,
    page,
    setSearchName,
    searchName,
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
  const tableRows = fetchBanner.flatMap((user) => {
    const schemas = Array.isArray(user?.goldSchemas) ? user.goldSchemas : [];

    if (schemas.length === 0) {
      return [
        {
          key: `${user?._id || "user"}-no-scheme`,
          user,
          schema: null,
        },
      ];
    }

    return schemas.map((schema, index) => ({
      key: `${user?._id || "user"}-${schema?._id || index}`,
      user,
      schema,
    }));
  });

  // ✅ SEARCH
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);
    handlegetAllData(page, itemPerPage, employeType, value);
  };

  const goToSchemeDetails = (membershipNo) => {
    if (!membershipNo) return;
    navigate(`/Customers/scheme/${encodeURIComponent(membershipNo)}`);
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
                      <td colSpan={tableHeadering.length} className="text-center">
                        No Data Available
                      </td>
                    </tr>
                  )}

                  {loading ? (
                    <tr>
                      <td colSpan={tableHeadering.length} className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    tableRows.map(({ key, user, schema }) => {
                      const membershipNo = schema?.membershipNo;
                      const paidMonths = schema?.paidMonths ?? 0;
                      const pendingMonths = schema?.pendingMonths ?? 0;

                      return (
                        <tr key={key}>
                          
                          <td
                            style={
                              membershipNo
                                ? { color: "#007bff", cursor: "pointer" }
                                : undefined
                            }
                            onClick={() => goToSchemeDetails(membershipNo)}
                          >
                            {user?.firstname}
                          </td>

                          <td>{user?.phone}</td>
                          <td>{user?.email}</td>

                          <td>{schema?.dateOfJoining || "-"}</td>
                          <td>{schema?.dateOfCompletion || "-"}</td>
                          <td>{membershipNo || "-"}</td>

                          <td>{paidMonths}</td>
                          <td>{pendingMonths}</td>

                          <td>{schema?.nextPaymentDate || "-"}</td>

                          {/* ACTION */}
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              onClick={() => goToSchemeDetails(membershipNo)}
                              disabled={!membershipNo}
                            >
                              View
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
