import React, { useEffect, useState } from "react";
import "./Billing.css";
import { useCustomer } from "../CustomerSupport/CustomerContext";
import { isAutheticated } from "src/auth";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const tableheadings = [
  "Date",
  "Invoice Number",
  "TransactionId",
  "Customer Name",
  "Total Amount",
  "Status",
  "Action",
];

const Billing = () => {
  const token = isAutheticated();
  const user = isAutheticated(); // 🔥 logged-in user

  const [search, setSearch] = useState("");
  const [searchByDate, setSearchByDate] = useState("");
  const { appdetails } = useCustomer();

  const [totalpages, setTotalPages] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [biling, setBiling] = useState([]);
  const navigate = useNavigate();

  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(",", "");
  };

  const getBiling = async (
    invoiceNo = search,
    page = currentPage,
    limit = itemPerPage,
    date = searchByDate
  ) => {
    try {
      setLoading(true);

      const params = { limit, page };

      if (invoiceNo && invoiceNo.trim() !== "") {
        params.invoiceNo = invoiceNo.trim();
      }

      if (date) {
        params.startDate = formatDateForBackend(date);
      }

      const res = await axios.get("/api/billing/get", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setBiling(res?.data);
      setTotalPages(res?.data?.totalPages || 1);
    } catch (error) {
      console.log("Billing error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBiling();
  }, [search, currentPage, itemPerPage, searchByDate]);

  // 🔥 ORIGINAL DATA
  let billingFetchData = biling?.AllSchemas || [];

  // 🔥 FILTER LOGIC (IMPORTANT)
  if (user?.role === "admin") {
    // 👉 ADMIN → only ONLINE (branch null)
    billingFetchData = billingFetchData.filter(
      (item) => !item?.branch || item.branch === null
    );
  } else {
    // 👉 EMPLOYEE → only their branch
    billingFetchData = billingFetchData.filter(
      (item) => item?.branch?._id === user?.branch?._id
    );
  }

  const summaryData = [
    {
      title: "Total Sales",
      value: `${biling?.summary?.totalSales || 0}`,
      color: "#27ae60",
    },
    {
      title: "Total Customers",
      value: `${biling?.summary?.totalCustomers || 0}`,
      color: "#111",
    },
    {
      title: "Total Received Amount",
      value: `₹ ${biling?.summary?.totalReceivedAmount || 0}`,
      color: "#111",
    },
  ];

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalpages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <div>
        <h3>Billing</h3>
      </div>

      <div className="billing-page">
        <main className="billing-main">

          {/* 🔍 FILTERS */}
          <header className="billing-header">
            <div className="date-range-picker">
              <label>Select Date:</label>
              <input
                type="date"
                value={searchByDate}
                onChange={(e) => {
                  setSearchByDate(e.target.value);
                }}
              />
            </div>

            <input
              className="billing-search"
              type="text"
              placeholder="Search By Invoice Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </header>

          {/* 📊 SUMMARY */}
          <section className="summary-cards">
            {summaryData.map((s) => (
              <div className="card" key={s.title}>
                <div className="card-title">{s.title}</div>
                <div className="card-value" style={{ color: s.color }}>
                  {loading ? <CircularProgress size={25} /> : s.value}
                </div>
              </div>
            ))}
          </section>

          {/* 📋 TABLE */}
          <section className="billing-table-wrap">
            <table className="billing-table">
              <thead>
                <tr>
                  {tableheadings.map((val) => (
                    <th key={val}>{val}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <CircularProgress size={40} />
                    </td>
                  </tr>
                ) : billingFetchData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Data Available
                    </td>
                  </tr>
                ) : (
                  billingFetchData.map((r, i) => (
                    <tr key={i}>
                      <td>{r?.createdAt}</td>
                      <td>{r?.InvoiceNo}</td>
                      <td>{r?.transactionId || "Offline"}</td>
                      <td>
                        {r?.customerId?.firstname}{" "}
                        {r?.customerId?.lastname}
                      </td>
                      <td>
                        ₹{r?.totalPricewithGst || r?.InvoiceId?.Amount}
                      </td>
                      <td>{r?.status}</td>

                      <td>
                        <button
                          className="view-btn"
                          onClick={() =>
                            navigate(`/Customers/user/Invoice/${r?._id}`)
                          }
                        >
                          👁 View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 🔢 PAGINATION */}
            <div className="orders-pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>
                ‹
              </button>

              {Array.from({ length: totalpages }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={handleNext}
                disabled={currentPage === totalpages}
              >
                ›
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="orders-footer">
        {appdetails?.map((val, index) => (
          <a
            href="https://neonflake.com"
            target="_blank"
            rel="noreferrer"
            key={index}
          >
            {val.copyrightMessage}
          </a>
        ))}
      </footer>
    </>
  );
};

export default Billing;