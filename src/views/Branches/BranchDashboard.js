import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { isAutheticated } from "src/auth";

const BranchDashboard = () => {
  const token = isAutheticated();

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/branch/dashboard", { headers });
      setBranches(res?.data?.result || []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (branchId) => {
    if (!branchId) return;

    try {
      setSelectedBranchId(branchId);
      setDetailsLoading(true);
      setError(null);

      const res = await axios.get(`/api/branch/dashboard/${branchId}`, { headers });
      setDetails(res?.data || null);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load branch details");
      setDetails(null);
    } finally {
      setDetailsLoading(false);
      setSelectedBranchId(null);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Branch Dashboard</h4>
              <Button variant="outlined" onClick={fetchSummary} disabled={loading}>
                Refresh
              </Button>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead style={{ background: "rgb(140, 213, 213)" }}>
                  <tr>
                    <th>Branch</th>
                    <th>Total Customers</th>
                    <th>Total Schemes</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : branches.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No branches found
                      </td>
                    </tr>
                  ) : (
                    branches.map((b) => (
                      <tr key={b?._id}>
                        <td>
                          <div style={{ fontWeight: 700 }}>
                            {b?.branchName || "-"}
                          </div>
                          <div style={{ color: "#6b7280", fontSize: "12px" }}>
                            {b?.branchCode || ""}
                          </div>
                        </td>
                        <td>{b?.totalCustomers ?? 0}</td>
                        <td>{b?.totalSchemes ?? 0}</td>
                        <td className="text-center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => fetchDetails(b?._id)}
                            disabled={detailsLoading && selectedBranchId === b?._id}
                          >
                            {detailsLoading && selectedBranchId === b?._id ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "View"
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {details?.branch && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">
                    {details?.branch?.branchName}{" "}
                    {details?.branch?.branchCode ? `(${details.branch.branchCode})` : ""}
                  </h5>
                  <Button variant="text" onClick={() => setDetails(null)}>
                    Close
                  </Button>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="card p-3">
                      <div style={{ color: "#6b7280", fontSize: "12px" }}>
                        Total Customers
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 800 }}>
                        {details?.totals?.totalCustomers ?? 0}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card p-3">
                      <div style={{ color: "#6b7280", fontSize: "12px" }}>
                        Total Schemes
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 800 }}>
                        {details?.totals?.totalSchemes ?? 0}
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="mt-3">Customers</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Total Schemes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(details?.customers || []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center">
                            No customers
                          </td>
                        </tr>
                      ) : (
                        details.customers.map((c) => (
                          <tr key={c?._id}>
                            <td>{c?.name || "-"}</td>
                            <td>{c?.phone || "-"}</td>
                            <td>{c?.email || "-"}</td>
                            <td>{c?.totalSchemes ?? 0}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <h6 className="mt-4">Schemes</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Membership No</th>
                        <th>Customer</th>
                        <th>Scheme</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Last Payment</th>
                        <th>Next Payment</th>
                        <th>Paid</th>
                        <th>Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(details?.schemes || []).length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center">
                            No schemes
                          </td>
                        </tr>
                      ) : (
                        details.schemes.map((s) => (
                          <tr key={s?._id}>
                            <td>{s?.membershipNo || "-"}</td>
                            <td>{s?.customerName || "-"}</td>
                            <td>{s?.schemeName || "-"}</td>
                            <td>{s?.startDate || "-"}</td>
                            <td>{s?.endDate || "-"}</td>
                            <td>{s?.lastPaymentDate || "-"}</td>
                            <td>{s?.nextPaymentDate || "-"}</td>
                            <td>{s?.paidMonths ?? 0}</td>
                            <td>{s?.pendingMonths ?? 0}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDashboard;

