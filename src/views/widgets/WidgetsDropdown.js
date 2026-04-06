import React, { useEffect, useState } from "react";
import { CRow, CCol, CWidgetStatsA } from "@coreui/react";
import { isAutheticated } from "src/auth";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

const WidgetsDropdown = () => {
  const user = isAutheticated();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="px-3 py-2">
      
      {/* 🔥 TITLE */}
      <h4 className="mb-3 fw-semibold text-dark">
        {user?.role === "admin"
          ? "Admin Dashboard"
          : "Branch Dashboard"}
      </h4>

      {/* 🔥 OVERVIEW */}
      <CRow className="mb-4">
        
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="primary"
            value={loading ? <CircularProgress size={22} /> : data?.totalCustomers}
            title={
              user?.role === "admin"
                ? "Total Customers"
                : "Branch Customers"
            }
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="info"
            value={loading ? <CircularProgress size={22} /> : data?.totalSchemes}
            title="Total Schemes"
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="success"
            value={loading ? <CircularProgress size={22} /> : data?.totalPaid}
            title="Total Paid Amount"
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="danger"
            value={loading ? <CircularProgress size={22} /> : data?.totalPending}
            title="Pending Amount"
          />
        </CCol>

      </CRow>

      {/* 🔥 SCHEME STATUS */}
      <h5 className="mb-3 fw-semibold text-dark">Scheme Status</h5>

      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="success"
            value={loading ? <CircularProgress size={22} /> : data?.activeSchemes}
            title="Active Schemes"
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="secondary"
            value={loading ? <CircularProgress size={22} /> : data?.completedSchemes}
            title="Completed Schemes"
          />
        </CCol>
      </CRow>

      {/* 🔥 UPCOMING PAYMENTS */}
      <h5 className="mb-3 fw-semibold text-dark">Upcoming Payments</h5>

      <CRow>
        {loading ? (
          <CircularProgress />
        ) : data?.upcomingPayments?.length > 0 ? (
          data.upcomingPayments.map((val, index) => (
            <CCol sm={6} lg={3} key={index}>
              <CWidgetStatsA
                className="mb-4 shadow-sm h-100"
                color="warning"
                value={val?.name}
                title={`Due: ${val?.nextPaymentDate}`}
              />
            </CCol>
          ))
        ) : (
          <p>No upcoming payments</p>
        )}
      </CRow>

    </div>
  );
};

export default WidgetsDropdown;