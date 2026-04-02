"use client";

import React, { useState } from "react";

const s = {
  page: {
    padding: "28px 24px",
    background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 60%, #fde68a 100%)",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#78350f",
    marginBottom: "22px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #fde68a",
    boxShadow: "0 2px 12px rgba(180,120,40,0.09)",
    overflow: "hidden",
  },
  sectionHead: {
    background: "linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sectionTitle: { color: "#fff", fontWeight: 600, fontSize: "14px" },
  badge: {
    width: "26px", height: "26px", borderRadius: "50%",
    background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.5)",
    color: "#fff", fontWeight: 700, fontSize: "12px",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  sectionBody: { padding: "20px" },
  input: {
    flex: 1, padding: "11px 14px",
    border: "1.5px solid #fcd88a", borderRadius: "10px",
    fontSize: "14px", color: "#1c1917", background: "#fffbf0",
    outline: "none", fontFamily: "inherit",
  },
  searchBtn: {
    padding: "11px 22px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #b45309, #f59e0b)",
    color: "#fff", fontWeight: 600, fontSize: "14px",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
    boxShadow: "0 3px 12px rgba(180,83,9,0.28)",
  },
  infoGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px",
    padding: "18px 20px",
  },
  infoCard: {
    background: "#fffbeb", borderRadius: "12px",
    border: "1px solid #fde68a", padding: "12px 16px",
  },
  infoLabel: { fontSize: "11px", fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" },
  infoValue: { fontSize: "16px", fontWeight: 700, color: "#1c1917" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "14px" },
  th: {
    padding: "11px 16px", background: "#fffbeb",
    color: "#92400e", fontWeight: 700, fontSize: "12px",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "2px solid #fde68a", textAlign: "left",
  },
  td: {
    padding: "13px 16px", borderBottom: "1px solid #fef3c7",
    color: "#1c1917", verticalAlign: "middle",
  },
  paidBadge: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "4px 12px", borderRadius: "20px",
    background: "#dcfce7", color: "#15803d",
    fontWeight: 600, fontSize: "12px",
  },
  payBtn: {
    padding: "10px 20px", borderRadius: "10px", border: "none",
    background: "linear-gradient(135deg, #b45309, #f59e0b)",
    color: "#fff", fontWeight: 600, fontSize: "14px",
    cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
    boxShadow: "0 3px 12px rgba(180,83,9,0.28)",
    whiteSpace: "nowrap",
  },
  // Modal overlay as normal-flow div (not fixed)
  modalOverlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: {
    background: "#fff", borderRadius: "20px",
    border: "1px solid #fde68a",
    boxShadow: "0 8px 40px rgba(180,83,9,0.18)",
    width: "380px", overflow: "hidden",
  },
  modalHead: {
    background: "linear-gradient(135deg, #b45309 0%, #d97706 60%, #f59e0b 100%)",
    padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  modalTitle: { color: "#fff", fontWeight: 700, fontSize: "16px" },
  modalBody: { padding: "22px 20px" },
  modalLabel: { fontSize: "11px", fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "5px", display: "block" },
  modalInput: {
    width: "100%", padding: "10px 13px",
    border: "1.5px solid #fcd88a", borderRadius: "10px",
    fontSize: "14px", color: "#1c1917", background: "#fffbf0",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: "14px",
  },
  submitBtn: {
    width: "100%", padding: "13px", borderRadius: "12px", border: "none",
    background: "linear-gradient(135deg, #b45309, #f59e0b)",
    color: "#fff", fontWeight: 700, fontSize: "15px",
    cursor: "pointer", marginBottom: "10px", fontFamily: "inherit",
    boxShadow: "0 4px 16px rgba(180,83,9,0.3)",
  },
  cancelBtn: {
    width: "100%", padding: "11px", borderRadius: "12px",
    border: "1.5px solid #fde68a", background: "#fffbf0",
    color: "#92400e", fontWeight: 600, fontSize: "14px",
    cursor: "pointer", fontFamily: "inherit",
  },
};

export default function PayInstallmentsPage() {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const dummyData = {
    name: "Raju",
    membershipId: "TE-00009",
    schemeName: "Bonus Scheme",
    monthlyAmount: 2000,
    installments: [
      { month: 1, status: "PAID", date: "01 Jan 2025", receipt: "RCP-001" },
      { month: 2, status: "PAID", date: "01 Feb 2025", receipt: "RCP-002" },
      { month: 3, status: "PENDING", date: "—", receipt: "—" },
      { month: 4, status: "PENDING", date: "—", receipt: "—" },
    ],
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    setCustomer(dummyData);
  };

  const nextPending = customer?.installments.find((i) => i.status === "PENDING");
  const paidInstallments = customer?.installments.filter((i) => i.status === "PAID") || [];
  const totalPaid = paidInstallments.length * (customer?.monthlyAmount || 0);

  const handleSubmitPayment = () => {
    if (!receiptNo || !receiptFile) {
      alert("Please fill all details");
      return;
    }
    const updatedInstallments = customer.installments.map((inst) =>
      inst.month === nextPending.month
        ? { ...inst, status: "PAID", date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), receipt: receiptNo }
        : inst
    );
    setCustomer({ ...customer, installments: updatedInstallments });
    setShowModal(false);
    setReceiptNo("");
    setReceiptFile(null);
    alert(`Month ${nextPending.month} marked as PAID ✅`);
  };

  return (
    <div style={s.page}>

      {/* PAGE TITLE */}
      <div style={s.pageTitle}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#b45309,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        Pay Installments
      </div>

      {/* SEARCH */}
      <div style={{ ...s.card, marginBottom: "20px" }}>
        <div style={s.sectionHead}>
          <div style={s.badge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2.5"/><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <span style={s.sectionTitle}>Search Customer</span>
        </div>
        <div style={{ ...s.sectionBody, display: "flex", gap: "12px" }}>
          <input
            style={s.input}
            type="text"
            placeholder="Enter Phone or Membership ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button style={s.searchBtn} onClick={handleSearch}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="2.5"/><path d="M21 21l-4.35-4.35" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Search
          </button>
        </div>
      </div>

      {/* CUSTOMER SECTION */}
      {customer && (
        <>
          {/* INFO CARDS */}
          <div style={{ ...s.card, marginBottom: "20px" }}>
            <div style={s.sectionHead}>
              <div style={s.badge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2.5"/></svg>
              </div>
              <span style={s.sectionTitle}>Customer Details</span>
            </div>
            <div style={s.infoGrid}>
              {[
                { label: "Customer Name", value: customer.name },
                { label: "Membership ID", value: customer.membershipId },
                { label: "Scheme Name", value: customer.schemeName },
                { label: "Monthly Amount", value: `₹${customer.monthlyAmount.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} style={s.infoCard}>
                  <div style={s.infoLabel}>{label}</div>
                  <div style={s.infoValue}>{value}</div>
                </div>
              ))}
            </div>

            {/* Summary strip */}
            <div style={{ display: "flex", gap: "12px", padding: "0 20px 18px" }}>
              {[
                { label: "Installments Paid", value: paidInstallments.length, color: "#15803d", bg: "#dcfce7" },
                { label: "Installments Pending", value: customer.installments.filter(i => i.status === "PENDING").length, color: "#b45309", bg: "#fef3c7" },
                { label: "Total Paid Amount", value: `₹${totalPaid.toLocaleString()}`, color: "#1d4ed8", bg: "#eff6ff" },
              ].map(({ label, value, color, bg }) => (
                <div key={label} style={{ flex: 1, background: bg, borderRadius: "10px", padding: "10px 16px" }}>
                  <div style={{ fontSize: "11px", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color, marginTop: "2px" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PAID INSTALLMENTS TABLE */}
          <div style={s.card}>
            <div style={s.sectionHead}>
              <div style={s.badge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={s.sectionTitle}>Paid Installments</span>
            </div>

            {/* Pay button row — right aligned, just above the table */}
            {nextPending && (
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 20px 0" }}>
                <button style={s.payBtn} onClick={() => setShowModal(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="#fff" strokeWidth="2"/>
                    <path d="M2 10h20" stroke="#fff" strokeWidth="2"/>
                  </svg>
                  Pay Month {nextPending.month}
                </button>
              </div>
            )}

            <div style={{ ...s.tableWrap, padding: "14px 20px 20px" }}>
              {paidInstallments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", color: "#a16207", fontSize: "14px" }}>
                  No paid installments yet
                </div>
              ) : (
                <table style={s.table}>
                  <thead>
                    <tr>
                      {["#", "Month", "Amount", "Payment Date", "Receipt No.", "Status"].map((h) => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paidInstallments.map((inst, idx) => (
                      <tr key={inst.month} style={{ background: idx % 2 === 0 ? "#fff" : "#fffbf0" }}>
                        <td style={{ ...s.td, color: "#a16207", fontWeight: 600 }}>{idx + 1}</td>
                        <td style={s.td}>Month {inst.month}</td>
                        <td style={{ ...s.td, fontWeight: 600 }}>₹{customer.monthlyAmount.toLocaleString()}</td>
                        <td style={{ ...s.td, color: "#57534e" }}>{inst.date}</td>
                        <td style={{ ...s.td, color: "#57534e", fontFamily: "monospace" }}>{inst.receipt}</td>
                        <td style={s.td}>
                          <span style={s.paidBadge}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#15803d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "#fffbeb", borderTop: "2px solid #fde68a" }}>
                      <td colSpan={2} style={{ ...s.td, fontWeight: 700, color: "#92400e" }}>Total</td>
                      <td style={{ ...s.td, fontWeight: 700, color: "#92400e" }}>₹{totalPaid.toLocaleString()}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      {showModal && nextPending && (
        <div style={s.modalOverlay}>
          <div style={s.modalBox}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>Pay Month {nextPending.month}</span>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "8px", width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >×</button>
            </div>
            <div style={s.modalBody}>

              {/* Amount info */}
              <div style={{ background: "#fffbeb", borderRadius: "12px", padding: "12px 16px", marginBottom: "18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#92400e", fontWeight: 600 }}>Amount Due</span>
                <span style={{ fontSize: "22px", fontWeight: 700, color: "#b45309" }}>₹{customer.monthlyAmount.toLocaleString()}</span>
              </div>

              <label style={s.modalLabel}>Receipt Number</label>
              <input
                style={s.modalInput}
                type="text"
                placeholder="e.g. RCP-003"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
              />

              <label style={s.modalLabel}>Upload Receipt</label>
              <div
                style={{
                  border: "2px dashed #fcd88a", borderRadius: "10px",
                  padding: "14px", textAlign: "center", background: "#fffbf0",
                  cursor: "pointer", marginBottom: "18px",
                }}
                onClick={() => document.getElementById("modalFileInput").click()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 6px", display: "block" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ margin: 0, fontSize: "13px", color: "#92400e", fontWeight: 600 }}>
                  {receiptFile ? receiptFile.name : "Click to upload receipt"}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#b45309" }}>JPG, PNG or PDF</p>
                <input id="modalFileInput" type="file" style={{ display: "none" }}
                  onChange={(e) => setReceiptFile(e.target.files[0] || null)} />
              </div>

              <button style={s.submitBtn} onClick={handleSubmitPayment}>Confirm Payment</button>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}