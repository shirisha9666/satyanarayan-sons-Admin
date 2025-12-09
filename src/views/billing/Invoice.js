import React, { useEffect, useState, memo } from "react";
import "./Invoice.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { isAutheticated } from "src/auth";
import logo from "../../assets/images/App icon.webp";
import { useBilling } from "./billingContext";

const formatCurrency = (n) => `₹${Number(n || 0).toFixed(2)}`;

const Invoice = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const token = isAutheticated();
  const { address } = useBilling();
  const logos = address?.[0]?.logo ||[];
      const appName = address?.[0]?.appName ;
 

  const getInvoiceDetails = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`/api/billing/get/user/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoice(resp.data);
    } catch (error) {
      console.error("Invoice fetch error:", error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getInvoiceDetails();
  }, [id, token]);

  if (loading) return <div className="invoice-loading">Loading invoice...</div>;
  if (!invoice)
    return <div className="invoice-empty">No invoice data found</div>;

  return (
    <div className="invoice-page">
      <div className="invoice-wrap">
        <aside className="invoice-sidebar" />

        <div className="invoice-main">
          <header className="inv-topbar">
            <div className="inv-left">
              <div className="inv-logo">
                <div className="logo-placeholder">
                  {logos.map((data, index) => {
                    return (
                      <img
                        key={index}
                        src={data?.Headerlogo?.fileUrl}
                        alt="logo"
                      />
                    );
                  })}
                </div>
              </div>
              <div className="inv-company">
                <div className="inv-company-name">{appName || "Knowdible"}</div>
                <div className="inv-company-addr">
                  Your trusted {appName || "Knowdible"} platform
                </div>
              </div>
            </div>

            <div className="inv-right">
              <div className="inv-heading">INVOICE</div>
              <div className="inv-sub">Audio Production</div>
              <div className="inv-meta-box">
                <div className="meta-row">
                  <span>INVOICE NUMBER</span>
                  <strong>{invoice.InvoiceNo}</strong>
                </div>
                <div className="meta-row">
                  <span>ISSUE DATE</span>
                  <strong>{invoice.createdAt}</strong>
                </div>
                <div className="meta-row">
                  <span>TRANSACTION ID</span>
                  <strong>{invoice.TransactionId}</strong>
                </div>
                <div className="meta-row amount-due">
                  <span>AMOUNT DUE</span>
                  <strong>{formatCurrency(invoice.Amount)}</strong>
                </div>
              </div>
            </div>
          </header>

          <section className="inv-bill-grid">
            <div className="bill-to">
              <h4>BILL TO:</h4>
              <div className="client-name">{invoice.userId.name}</div>
              <div className="muted">{invoice.userId.email}</div>
            </div>

            <div className="plan-box">
              <div className="plan-label">Plan Details</div>
              <div className="plan-row">
                <span>Plan</span>
                <strong>{invoice.PlanId.Plan}</strong>
              </div>
              <div className="plan-row">
                <span>Duration</span>
                <strong>{invoice.PlanId.Duration}</strong>
              </div>
              <div className="plan-row">
                <span>Start Date</span>
                <strong>{invoice.plan_start_date}</strong>
              </div>
              <div className="plan-row">
                <span>Expiry Date</span>
                <strong>{invoice.plan_expiry_date}</strong>
              </div>
            </div>
          </section>

          <section className="inv-table">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="right">Price</th>
                  <th className="right" >GST ({invoice.gst}%)</th>
                  <th className="right" style={{display:"flex",justifyContent:"end"}}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <strong>{invoice.PlanId.Plan}</strong>
                    </div>
                    <div className="muted">
                      {invoice.PlanId.features?.join(", ")}
                    </div>
                  </td>
                  <td  style={{display:"flex",justifyContent:"start"}}>
                    {formatCurrency(invoice.Original_price)}
                  </td>
                  <td  >{formatCurrency(invoice.totalGst)}</td>
                  <td className="right">{formatCurrency(invoice.Amount)}</td>
                </tr>
              </tbody>
            </table>

            <div className="totals">
              <div className="totals-row">
                <span>SUBTOTAL</span>
                <strong>{formatCurrency(invoice.Original_price)}</strong>
              </div>
              <div className="totals-row">
                <span>GST ({invoice.gst}%)</span>
                <strong>{formatCurrency(invoice.totalGst)}</strong>
              </div>
              <div className="totals-row total">
                <span>TOTAL AMOUNT</span>
                <strong>{formatCurrency(invoice.Amount)}</strong>
              </div>
            </div>
          </section>

          <section className="inv-notes">
            <h4>NOTES:</h4>
            <div className="notes-box">
              Thank you for your business! Your payment was processed on{" "}
              {invoice.razorypayTime}.<br />
              Transaction ID: {invoice.TransactionId}
              <br />
              Order ID: {invoice.RazorpayOrderId}
              <br />
              RazorpaySignature: {invoice.RazorpaySignature}
              <br />
            </div>
          </section>
          <section className="inv-details-card">
  <div className="details-card">


    <div className="detail-row">
      <span className="label">Razorpay Date:</span>
      <span className="value">{invoice.razorypayTime}</span>
    </div>

    <div className="detail-row">
      <span className="label">Transaction ID:</span>
      <span className="value">{invoice.TransactionId}</span>
    </div>

    <div className="detail-row">
      <span className="label">Order ID:</span>
      <span className="value">{invoice.RazorpayOrderId}</span>
    </div>

    <div className="detail-row">
      <span className="label">Signature:</span>
      <span className="value">{invoice.RazorpaySignature}</span>
    </div>
  </div>
</section>

        </div>
      </div>
      
    </div>
  );
};

export default memo(Invoice);
