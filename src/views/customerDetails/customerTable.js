import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAutheticated } from "src/auth";
import swal from "sweetalert";
import OrderDetails from "./orderDetails";
import * as XLSX from "xlsx";
import { CircularProgress } from "@material-ui/core";
import { useBilling } from "../billing/billingContext";

const CustomerTable = () => {
  const token = isAutheticated();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(null);
  const [success, setSuccess] = useState(true);
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [showData, setShowData] = useState(users);


  const handleShowEntries = (e) => {
    setCurrentPage(1);
    setItemPerPage(e.target.value);
  };

  const getUsers = async () => {
    axios
      .get(`/api/v1/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data.usersmap);
        setLoading(false);
      })
      .catch((error) => {
       
        setLoading(false);
      });
  };

  const handelButtonToggle = async (id) => {
    try {
      setBtnLoading(id);
      let resp = await axios.put(
        `/api/v1/admin/status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let msg = resp.data.message;
      await getUsers();
      toast.success(msg);
    } catch (error) {
      console.log("error", error);
      let msg = error?.response?.data?.message;
      // console.log("error", error);
    } finally {
      setBtnLoading(null);
    }
  };
  useEffect(() => {
    getUsers();
  }, [success]);
  console.log(users);

  useEffect(() => {
    const loadData = () => {
      const indexOfLastPost = currentPage * itemPerPage;
      const indexOfFirstPost = indexOfLastPost - itemPerPage;
      setShowData(users?.slice(indexOfFirstPost, indexOfLastPost));
    };
    loadData();
  }, [currentPage, itemPerPage, users]);

  const handleOnExport = () => {
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(users);
    XLSX.utils.book_append_sheet(wb, ws, "Customers-Sheet-1");
    XLSX.writeFile(wb, "Customers.xlsx");
  };

  console.log("users", users);
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div
                className="
                    page-title-box
                    d-flex
                    align-items-center
                    justify-content-between
                  "
              >
                <div style={{ fontSize: "22px" }} className="fw-bold">
                  All Customers
                </div>

                <div className="page-title-right">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textTransform: "capitalize",
                    }}
                    onClick={() => {
                      navigate("/add-customer");
                    }}
                  >
                    Add Customer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row ml-0 mr-0 mb-10 ">
                    <div
                      className="col-sm-12 col-md-12"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="dataTables_length w-50">
                        <label className="w-100">
                          Show
                          <select
                            style={{ width: "10%" }}
                            name=""
                            onChange={(e) => handleShowEntries(e)}
                            className="
                                select-w
                                custom-select custom-select-sm
                                form-control form-control-sm
                              "
                          >
                            <option value="150">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                          entries
                        </label>
                      </div>
                      <div className="page-title-right">
                        <Button
                          onClick={handleOnExport}
                          variant="contained"
                          color="primary"
                          style={{
                            fontWeight: "bold",
                            marginBottom: "1rem",
                            textTransform: "capitalize",
                            background: "orange",
                          }}
                        >
                          Dowloade Excel
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive table-shoot mt-3">
                    <table
                      className="table table-centered table-nowrap"
                      style={{ border: "1px solid" }}
                    >
                      <thead
                        className="thead-info"
                        style={{ background: "rgb(140, 213, 213)" }}
                      >
                        <tr>
                          <th>Customer Name</th>
                          <th>Login Type </th>
                          {/* <th>Profile Image</th> */}

                          <th>Date Registered</th>
                          <th>Plan Status</th>
                          <th>Orders</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && showData?.length === 0 && (
                          <tr className="text-center">
                            <td colSpan="6">
                              <h5>No Data Available</h5>
                            </td>
                          </tr>
                        )}
                        {loading ? (
                          <tr>
                            <td className="text-center" colSpan="6">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          showData?.map((user, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-start">{user.user.name}</td>
                                <td>
                                  {user.user.logintype
                                    ? user.user.logintype
                                    : "not login yet"}
                                </td>

                                <td className="text-start">
                                  {user.user.createdAt}
                                </td>
                                <td className="text-start">
                                  {typeof user.lastplan === "string"
                                    ? user.lastplan // 👉 shows "not_taken_plan"
                                    : user.lastplan?.planPurchaseStatus ||
                                      "N/A"}
                                </td>
                                <td className="text-start">
                                  {" "}
                                  {user.totalPlans}
                                </td>

                                {/* <OrderDetails
                                  _id={user?._id}
                                  setLoading1={setLoading1}
                                /> */}

                                <td
                                  className="text-start "
                                  style={{
                                    display: "flex",
                                    gap: "1rem",
                                    width: "100%",
                                  }}
                                >
                                  <Link 
                                    to={`/customers-details/${user?.user._id}`}
                                  >
                                    <button
                                      type="button"
                                      className="mt-1 btn btn-info btn-sm  waves-effect waves-light btn-table ml-2"
                                    >
                                      View
                                    </button>
                                  </Link>


                                  <button style={{   width:"40%",}}
                                    onClick={() =>
                                      handelButtonToggle(user?.user._id)
                                    }
                                    type="button"
                                    disabled={typeof user.lastplan === "string"}
                                    className={`mt-1 w-20 btn btn-sm pointer waves-effect waves-light btn-table ml-2 ${
                                      user.lastplan?.planPurchaseStatus ===
                                      "Active"
                                        ? "btn-danger"
                                        : "btn-success"
                                    }`}
                                  >
                                    {btnloading === user?.user._id ? (
                                      <CircularProgress size={25} />
                                    ) : user.lastplan.planPurchaseStatus ===
                                      "Active" ? (
                                      "Suspend"
                                    ) : (
                                      "Active"
                                    )}
                                  </button>

                                  
                                  <Link style={{   width:"40%",}}
                                    to={`/user/invoice/${user?.user?.name}/${user?.user?._id}`}
                                  >
                                    <button
                                      disabled={
                                        typeof user.lastplan === "string"
                                      }
                                      style={{
                                        backgroundColor: `${
                                          typeof user.lastplan === "string"
                                            ? "#BDBDBD"
                                            : "#43A047"
                                        }`,
                                        color: "#fff",
                                     
                                        border: "none",
                                        padding: "6px 14px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "500",

                                        transition: "all 0.2s ease-in-out",
                                      }}
                                    >
                                      🧾 Invoices
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="row mt-20">
                    <div className="col-sm-12 col-md-6 mb-20">
                      <div
                        className="dataTables_info"
                        id="datatable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {currentPage * itemPerPage - itemPerPage + 1} to{" "}
                        {Math.min(currentPage * itemPerPage, users?.length)} of{" "}
                        {users?.length} entries
                      </div>
                    </div>

                    <div className="col-sm-12 col-md-6">
                      <div className="d-flex">
                        <ul className="pagination ms-auto">
                          <li
                            className={
                              currentPage === 1
                                ? "paginate_button page-item previous disabled"
                                : "paginate_button page-item previous"
                            }
                          >
                            <span
                              className="page-link"
                              style={{ cursor: "pointer" }}
                              onClick={() => setCurrentPage((prev) => prev - 1)}
                            >
                              Previous
                            </span>
                          </li>

                          {!(currentPage - 1 < 1) && (
                            <li className="paginate_button page-item">
                              <span
                                className="page-link"
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  setCurrentPage((prev) => prev - 1)
                                }
                              >
                                {currentPage - 1}
                              </span>
                            </li>
                          )}

                          <li className="paginate_button page-item active">
                            <span
                              className="page-link"
                              style={{ cursor: "pointer" }}
                            >
                              {currentPage}
                            </span>
                          </li>

                          {!(
                            (currentPage + 1) * itemPerPage - itemPerPage >
                            users?.length - 1
                          ) && (
                            <li className="paginate_button page-item ">
                              <span
                                className="page-link"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setCurrentPage((prev) => prev + 1);
                                }}
                              >
                                {currentPage + 1}
                              </span>
                            </li>
                          )}

                          <li
                            className={
                              !(
                                (currentPage + 1) * itemPerPage - itemPerPage >
                                users?.length - 1
                              )
                                ? "paginate_button page-item next"
                                : "paginate_button page-item next disabled"
                            }
                          >
                            <span
                              className="page-link"
                              style={{ cursor: "pointer" }}
                              onClick={() => setCurrentPage((prev) => prev + 1)}
                            >
                              Next
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
