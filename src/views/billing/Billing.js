import React, { useEffect, useState } from "react";
import "./Billing.css";
import { useCustomer } from "../CustomerSupport/CustomerContext";
import { isAutheticated } from "src/auth";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { useBilling } from "./billingContext";

const tableheadings = [
  "Date & Time",
  "Invoice Number",
  "TransactionId",
  "Customer Name",
  "Total Amount",

  "Status",
  "Action",
];

const Billing = () => {
  const { billingInvoice, getBilingInvoice } = useBilling();

  const token = isAutheticated();
  const [search, setSearch] = useState();
  const [searchByDate, setSearchByDate] = useState();
  const { appdetails } = useCustomer();

  const [totalpages, setTotalPages] = useState();
  const [itemPerPage, setItemPerPage] = useState(10);

  const [currentPage, setCurrentPage] = useState();
  const [errormsge, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [biling, setBiling] = useState([]);
  const navigate = useNavigate();

  const getBiling = async (
    searchName = search,
    page = 1,
    limit = itemPerPage,
    date = searchByDate
  ) => {
    try {
      setLoading(true);
      const params = { limit, page };
      if (searchName && searchName.trim() !== "") {
        params.name = searchName.trim();
      }
      if (searchByDate && searchByDate.trim() !== "") {
        params.date = searchByDate.trim();
      }

      const res = await axios.get("/api/billing/get", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setBiling(res?.data);
      setTotalPages(res.data.totalPages);
      // setCurrentPage(res.data.currentPage);
      setItemPerPage(limit);
    } catch (error) {
      const msg = error.response?.data?.message || "Internal Server Error";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBiling(search, currentPage, itemPerPage, searchByDate);
  }, [search, currentPage, itemPerPage, searchByDate]);

  const summaryData = [
    { title: "Total Sales", value: `${biling?.totalsales}`, color: "#27ae60" },

    {
      title: "Total Received Amount",
      value: `₹${biling?.totalAmount}`,
      color: "#111",
    },
  ];

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < totalpages) setCurrentPage((prev) => prev - 1);
  };
  return (
    <>
      <div>
        <h3>Billing</h3>
      </div>
      <div className="billing-page">
        <main className="billing-main">
          <header className="billing-header">
            {/* <div className="date-range">
                            Last 7 Days - 15 July 2023 to 21 July 2023
                        </div> */}
            <div className="date-range-picker">
              <label htmlFor="filterDate" className="date-label">
                Select Date:
              </label>
              <input
                type="text"
                id="filterDate"
                placeholder="dd/mm/yyyy"
                value={searchByDate}
                onChange={(e) => setSearchByDate(e.target.value)}
                className="date-input"
              />
              <button
                className="orders-view-btn p-2"
                onClick={() => setSearchByDate(selectedDate)}
              >
                Filter
              </button>
            </div>

            <div className="">
              <input
                className="billing-search "
                type="text"
                placeholder="Search By Invoice Number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

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

          <section className="billing-table-wrap">
            <table className="billing-table">
              <thead>
                <tr>
                  {tableheadings.map((val) => (
                    <th>{val}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <CircularProgress
                          size={50}
                          thickness={5}
                          style={{ color: "#1976d2" }}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  biling?.data?.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? "odd" : "even"}>
                      <td>{r?.createdAt}</td>
                      <td>{r?.InvoiceId?.InvoiceNo}</td>
                      <td>
                        {r?.InvoiceId?.TransactionId === null
                          ? "Null"
                          : r?.InvoiceId?.TransactionId}
                      </td>
                      <td className="text-center">{r?.userId?.name}</td>
                      <td className="text-center">
                        {r.InvoiceId?.Amount === "0"
                          ? r?.InvoiceId?.Amount
                          : `₹${r?.InvoiceId?.Amount}`}
                      </td>

                      {/* <td>{r.due}</td> */}
                      <td>{r?.status}</td>
                      {/* <td>
                                                <div style={{ display: "flex", gap: "10px" }}>
                                                    <button
                                                        className="orders-view-btn p-2"
                                                        onClick={() =>
                                                            navigate(`/view/${r.userId._id}`)
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                    <div>
                                                        <button
                                                            className="orders-view-btn p-2"
                                                            onClick={() =>

                                                                navigate(`/invoice/${r.userId._id}`)
                                                            }
                                                        >
                                                            Invoice
                                                        </button>
                                                    </div>

                                                </div>
                                            </td> */}
                      <td>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            style={{
                              backgroundColor: "#1E88E5",
                              color: "#fff",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "500",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#1565C0")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#1E88E5")
                            }
                            // onClick={() => navigate(`/view/${r?.userId?._id}`)}
                            onClick={() => navigate(`/invoice/view/${r?.InvoiceId?._id}`)}
                          >
                            👁 View
                          </button>

                          {/* <button
                            style={{
                              backgroundColor: "#43A047",
                              color: "#fff",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "500",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#2E7D32")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#43A047")
                            }
                            onClick={() => navigate(`/user/invoice/${r?.userId?.name}/${r?.userId?._id}`)}
                          >
                            🧾 Invoice
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* <div className="orders-pagination">
                            <button
                                className="orders-page-btn"
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalpages }, (_, i) => {
                                const isActive = currentPage === i + 1;
                                return (
                                    <button
                                        key={i + 1}
                                        className={
                                            isActive
                                                ? "orders-page-num-active"
                                                : "orders-page-num-inactive"
                                        }
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}

                            <button
                                className="orders-page-btn"
                                onClick={handleNext}
                                disabled={currentPage === totalpages}
                            >
                                ›
                            </button>
                        </div> */}
            <div className="orders-pagination">
              <button
                className="page-nav-btn"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                ‹
              </button>

              {Array.from({ length: totalpages }, (_, i) => {
                const isActive = currentPage === i + 1;
                return (
                  <button
                    key={i + 1}
                    className={`page-num-btn ${isActive ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                );
              })}

              <button
                className="page-nav-btn"
                onClick={handleNext}
                disabled={currentPage === totalpages}
              >
                ›
              </button>
            </div>
          </section>
        </main>
      </div>
      <footer className="orders-footer">
        {appdetails?.map((val, index) => {
          return (
            <a
              href="https://neonflake.com"
              target="_blank"
              rel="noreferrer"
              key={index}
            >
              {val.copyrightMessage}
            </a>
          );
        })}
      </footer>
    </>
  );
};

export default Billing;
