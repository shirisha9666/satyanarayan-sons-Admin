import React, { useEffect, useState } from "react";
import "./BilingInvoice.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { isAutheticated } from "src/auth";
import { CircularProgress } from "@material-ui/core";

const sample = {
    invoice: "#2942398222",
    customer: "Mehak kumar",
    plan: {
        name: "Professional",
        type: "annually",
        start: "Sep 16, 2025",
        expiry: "Sep 16, 2026",
    },
    payment: {
        paymentId: "pay_RI9rIBC76qo5pf",
        orderId: "order_RI9rbNC4Dr4Kxf",
        signature:
            "7a7ed5d11432607783e88c6bd9f99e5c0777bd63037085505d11b42547957576",
        ip: "::1",
        paidAt: "9/16/2025, 11:00:19 AM",
    },
    additional: "No additional notes.",
};

const BilingInvoice = () => {
    const [billingInvoice, setBillingInvoice] = useState([]);
    const [loading, setLoading] = useState(null);
    const [InvoiceError, setInvoiceError] = useState("")
    const { id } = useParams();

    const token = isAutheticated();

    const getBilingInvoice = async () => {
        try {
            setLoading(id);
            const res = await axios.get(`/api/billing/get/invoice/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        
            setBillingInvoice(res?.data);
        } catch (error) {
            const msg = error.response?.data?.message || "Internal Server Error";
            setInvoiceError(msg)

        } finally {
            setLoading(null);
        }
    };
    useEffect(() => {
        getBilingInvoice(id);
    }, [id]);
    return (
        <>
            {loading ? (
                <div
                    className="card"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <CircularProgress style={{ fontSize: "25rem" }} />
                </div>
            ) : InvoiceError ? <span>{InvoiceError}</span> : billingInvoice.length === 0 ? (
                <div
                    className="card"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <span>No Invoice Found</span>
                </div>
            ) : (
                billingInvoice.map((item, index) => {
                    return (
                        <div className="invoice-page" key={index}>
                            <header className="invoice-header">
                                <div className="invoice-left">
                                    <div className="invoice-icon">i</div>
                                    <div>
                                        <div className="invoice-title">
                                            Invoice{" "}
                                            <span className="invoice-num">{item.InvoiceNo}</span>
                                        </div>
                                        <div className="invoice-customer">{item.userId.name}</div>
                                    </div>
                                </div>
                                <div className="invoice-badge">razorpay</div>
                            </header>

                            <main className="invoice-content">
                                <section className="card">
                                    <h3 className="card-title">
                                        <span className="card-icon">📅</span> Plan Information
                                    </h3>
                                    <table className="info-table">
                                        <tbody>
                                            <tr>
                                                <td>Plan Name</td>
                                                <td>{item.PlanId.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Plan Type</td>
                                                <td>{item.PlanId.Package}</td>
                                            </tr>
                                            <tr>
                                                <td>Start Date</td>
                                                <td>{item.plan_start_date}</td>
                                            </tr>
                                            <tr>
                                                <td>Expiry Date</td>
                                                <td>{item.plan_expiry_date}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>

                                <section className="card">
                                    <h3 className="card-title">
                                        <span className="card-icon">💵</span> Payment Information
                                    </h3>
                                    <table className="info-table">
                                        <tbody>
                                            <tr>
                                                <td>Razorpay Payment ID</td>
                                                <td>{item.TransactionId}</td>
                                            </tr>
                                            <tr>
                                                <td>Razorpay Order ID</td>
                                                <td>{item.RazorpayOrderId}</td>
                                            </tr>
                                            <tr>
                                                <td>Razorpay Signature</td>
                                                <td className="long">{item.RazorpaySignature}</td>
                                            </tr>
                                            {/* <tr><td>IP Address</td><td>{sample.payment.ip}</td></tr> */}
                                            <tr>
                                                <td>Paid At</td>
                                                <td>{item.createdAt}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>

                                <section className="card">
                                    <h3 className="card-title">
                                        <span className="card-icon">ℹ️</span> Additional Details
                                    </h3>
                                    <div className="additional">{sample.additional}</div>
                                </section>
                            </main>
                        </div>
                    );
                })
            )}
        </>
    );
};

export default BilingInvoice;
