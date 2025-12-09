import React, { useEffect, useState } from "react";
import "./BilingView.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";
import { useBilling } from "./billingContext";
import { CircularProgress } from "@mui/material";

const ViewBiling = () => {
    const [billingInvoiceView, setBillingInvoiceView] = useState([]);
    const [loading, setLoading] = useState(null);
    const [InvoiceError, setInvoiceError] = useState("");
    const { billingInvoice, data } = useBilling();
    const { id } = useParams();
    const navigate = useNavigate();

    console.log("ViewBiling....................", billingInvoice, data);

    const token = isAutheticated();

    const getBilingInvoiceView = async () => {
        try {
            setLoading(id);
            const res = await axios.get(`/api/billing/get/view/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("res", res);
            setBillingInvoiceView(res?.data);
        } catch (error) {
            const msg = error.response?.data?.message || "Internal Server Error";

            setInvoiceError(msg);
        } finally {
            setLoading(null);
        }
    };
    useEffect(() => {
        getBilingInvoiceView(id);
    }, [id]);

    const invoicesWithGST = billingInvoiceView.invoicesWithGST;
  

console.log("invoicesWithGST?",invoicesWithGST)

    return (
        <div className="userpage-container">
            <div className="userpage-actions">
           
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/invoice/view/${invoicesWithGST._id}`)}
                >
                    User Invoices
                </button>
            </div>

            <div className="userpage-grid">
                <div className="card profile-card">
                    <div className="card-header dark">
                        <h3>User Profile</h3>
                    </div>
                    {loading ? (
                        <div className="text-center py-5">
                            <CircularProgress />
                        </div>
                    ) : InvoiceError ? (
                        <span>{InvoiceError}</span>
                    ) : (
                      
                         <div className="invoice-page" >
                            <header className="invoice-header">
                                <div className="invoice-left">
                                    <div className="invoice-icon">i</div>
                                    <div>
                                        <div className="invoice-title">
                                            Invoice{" "}
                                            <span className="invoice-num">{invoicesWithGST?.InvoiceNo}</span>
                                        </div>
                                        <div className="invoice-customer">{invoicesWithGST?.userId.name}</div>
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
                                                <td>{invoicesWithGST?.PlanId.Plan}</td>
                                            </tr>
                                            <tr>
                                                <td>Plan Type</td>
                                                <td>{invoicesWithGST?.PlanId.Duration}</td>
                                            </tr>
                                            <tr>
                                                <td>Start Date</td>
                                                <td>{invoicesWithGST?.plan_start_date}</td>
                                            </tr>
                                            <tr>
                                                <td>Expiry Date</td>
                                                <td>{invoicesWithGST?.plan_expiry_date}</td>
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
                                                <td>{invoicesWithGST?.TransactionId}</td>
                                            </tr>
                                            <tr>
                                                <td>Razorpay Order ID</td>
                                                <td>{invoicesWithGST?.RazorpayOrderId}</td>
                                            </tr>
                                            <tr>
                                                <td>Razorpay Signature</td>
                                                <td className="long">{invoicesWithGST?.RazorpaySignature}</td>
                                            </tr>
                                            {/* <tr><td>IP Address</td><td>{sample.payment.ip}</td></tr> */}
                                            <tr>
                                                <td>Paid At</td>
                                                <td>{invoicesWithGST?.createdAt}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>

                               
                            </main>
                        </div>
                    )}
                </div>

              
            </div>
        </div>
    );
};

export default ViewBiling;
