import axios from "axios";
import React, { useEffect, useState } from "react";
import { isAutheticated } from "src/auth";

import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useGoldSchema } from "src/views/Gold-Schema/GoldSchemaContext";
import toast from "react-hot-toast";
import { CircularProgress } from "@material-ui/core";

function Tax() {
  // const [taxList, settaxList] = useState([]);
  const [success, setSuccess] = useState(true);

  const { taxList, loading, getTaxes } = useGoldSchema();
  const [delLoading, setDelLoading] = useState(null);
  const token = isAutheticated();

  const handleDelete = async (id) => {
    try {
      setDelLoading(id);
      let res =await axios.delete(`/api/tax/delete_tax/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await getTaxes();
      toast.success("GST Deleted Succssfully");
    } catch (error) {
      console.log("handleDelete", error);
    } finally {
      setDelLoading(null);
    }
  };
  // function handleDelete(id) {
  //   axios
  //     .delete(`/api/tax/delete_tax/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setSuccess((prev) => !prev)
  //       getTaxes()
  //     }
  //     )
  //     .catch((err) => swal("Error!", "Something went wrong!", "error"));
  // }

  const handleStatus = () => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: {
        Yes: { text: "Yes", value: true },
        Cancel: { text: "Cancel", value: "cancel" },
      },
    }).then((value) => {
      if (value === true) {
        axios
          .patch(
            `/api/tax/update`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            swal({
              title: "Changed",
              text: "status changed successfully!",
              icon: "success",
              button: "ok",
            });
            setSuccess((prev) => !prev);
          })
          .catch((err) => {
            swal({
              title: "Warning",
              text: "Something went wrong!",
              icon: "error",
              button: "Retry",
              dangerMode: true,
            });
          });
      }
    });
  };
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row ml-0 mr-0 mb-10">
                    <div className="col-sm-12 col-md-6"></div>
                    <div className="col-sm-12 col-md-6">
                      <div className="m-1 d-flex align-items-center justify-content-end gap-3">
                        {/* <button
                          type="button"
                          className=" btn btn-warning text-white  "
                          onClick={() => handleStatus()}
                        >
                          <i className="fa fa-plus mb-2" aria-hidden="true"></i>{" "}
                          Change Status
                        </button> */}
                        <Link to="/tax/add">
                          <button
                            type="button"
                            className="
                                btn btn-primary"
                          >
                            <i
                              className="fa fa-plus mb-2"
                              aria-hidden="true"
                            ></i>{" "}
                            Add New GST Rate
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive table-shoot mt-2">
                    <table className="table table-centered table-nowrap mb-0">
                      <thead
                        className="thead"
                        style={{ background: "rgb(140, 213, 213)" }}
                      >
                        <tr>
                          <th>Name</th>
                          <th>GST Rate</th>
                          {/* <th>Status</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        )}
                        {taxList.map((tax, index) => {
                          return (
                            <tr key={index}>
                              <td>{tax.name}</td>
                              <td>{tax.tax}%</td>
                              {/* <td
                                className={`badge mt-1 text-white ${
                                  tax?.active === true
                                    ? "text-bg-success"
                                    : "text-bg-secondary"
                                }`}
                              >
                                {" "}
                                {tax?.active ? "Active" : "Not Active"}
                              </td> */}

                              <td>
                                {/* {tax?.active ? (
                                  <Link to={`/tax/edit/${tax._id}`}>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm waves-effect waves-light btn-table me-2"
                                    >
                                      Edit
                                    </button>
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm waves-effect waves-light btn-table me-2"
                                    disabled
                                  >
                                    Edit
                                  </button>
                                )} */}
                                <Link to={`/tax/edit/${tax._id}`}>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm waves-effect waves-light btn-table me-2"
                                  >
                                    Edit
                                  </button>
                                </Link>

                                <button
                                  type="button"
                                  className=" btn btn-danger btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    ml-2
                                  "
                                  // disabled={!tax?.active}
                                  onClick={() => handleDelete(tax._id)}
                                  id="sa-params"
                                >
                                  {delLoading === tax._id ? (
                                    <CircularProgress size={25} />
                                  ) : (
                                    "Delete"
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tax;
