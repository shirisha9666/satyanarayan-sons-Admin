import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from 'sweetalert'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAutheticated } from "../../auth";
import CIcon from "@coreui/icons-react";
import {
  cibCoveralls,
  cibDiaspora,
  cilExternalLink,
  cilPencil,
  cilStar,
  cilStarHalf,
  cilTrash,
} from "@coreui/icons";

const Celebrities = () => {
  const token = isAutheticated();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [celebritiesData, setCelebritiesData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [showData, setShowData] = useState(celebritiesData);

  const handleShowEntries = (e) => {
    setCurrentPage(1);
    setItemPerPage(e.target.value);
  };

  const getCelebritiesData = async () => {
    axios
      .get(`/api/celebrity/getAll/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // sort data by updated date
        res.data?.celebrity.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        setCelebritiesData(res.data?.celebrity);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCelebritiesData();
  }, [success]);

  useEffect(() => {
    const loadData = () => {
      const indexOfLastPost = currentPage * itemPerPage;
      const indexOfFirstPost = indexOfLastPost - itemPerPage;
      setShowData(celebritiesData.slice(indexOfFirstPost, indexOfLastPost));
    };
    loadData();
  }, [currentPage, itemPerPage, celebritiesData]);

  const handleDelete = (id) => {
    swal({
      title: "Are you sure?",
      icon: "error",
      buttons: {
        Yes: { text: "Yes", value: true },
        Cancel: { text: "Cancel", value: "cancel" },
      },
    }).then((value) => {
      if (value === true) {
        axios
          .delete(`/api/celebrity/delete/${id}`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            swal({
              title: "Deleted",
              text: "celebrity Deleted successfully!",
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

  // search
  const handleSearch = (e) => {
    let value = e.target.value;
    let result = [];
    if (value.length > 0) {
      result = celebritiesData.filter((data) => {
        return data.name.toLowerCase().includes(value.toLowerCase());
      });
      setShowData(result);
    } else {
      setShowData(celebritiesData);
    }
  };

  console.log(celebritiesData);

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
                  celebrities
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
                      navigate("/celebrity/add", { replace: true });
                    }}
                  >
                    Add celebrity
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row ml-0 mr-0 mb-10">
                    <div className="col-sm-12 col-md-12">
                      <div className="dataTables_length">
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
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                          entries
                        </label>
                      </div>

                      <div className="dataTables_filter">
                        <label>
                          Search:
                          <input
                            type="search"
                            className="
                                form-control
                                form-control-sm border
                                ml-2
                                  rounded-pill  border-1
                              "
                            placeholder="Search by name"
                            aria-controls="DataTables_Table_0"
                            onChange={(e) => {
                              handleSearch(e);
                            }}
                          />
                        </label>
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
                          <th className="text-start">celebrity Name</th>
                          <th className="text-start">Image</th>
                          <th className="text-start">Added On</th>
                          <th className="text-start">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && showData.length === 0 && (
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
                          showData.map((celebrity, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-start">
                                  {celebrity.setAsFeatured ? (
                                    <CIcon
                                      icon={cibCoveralls}
                                      className="text-warning"
                                      style={{ fontSize: "1.2rem" }}
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {` ${celebrity.name}`}
                                </td>
                                <th>
                                  {celebrity.image &&
                                    celebrity.image.map((i) => (
                                      <img
                                        key={i._id}
                                        className="me-2"
                                        src={`${i?.url}`}
                                        width="40"
                                        alt=""
                                      />
                                    ))}
                                </th>

                                <td className="text-start">
                                  {new Date(celebrity.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                      weekday: "short",
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    }
                                  )}
                                </td>

                                <td className="text-start">
                                  <Link to={`/celebrity/view/${celebrity._id}`}>
                                    <button
                                      style={{
                                        color: "white",
                                        marginRight: "1rem",
                                      }}
                                      type="button"
                                      className="
                                      btn btn-primary btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                                    >
                                      View
                                    </button>
                                  </Link>
                                  <Link to={`/celebrity/edit/${celebrity._id}`}>
                                    <button
                                      style={{
                                        color: "white",
                                        marginRight: "1rem",
                                      }}
                                      type="button"
                                      className="
                                      btn btn-info btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mt-1
                                    mx-1
                                  "
                                    >
                                      Edit
                                    </button>
                                  </Link>
                                  <Link
                                    to={"#"}
                                    style={{
                                      marginRight: "1rem",
                                    }}
                                  >
                                    <button
                                      style={{ color: "white" }}
                                      type="button"
                                      className="
                                    btn btn-danger btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mt-1
                                    mx-1
                                    
                                  "
                                      onClick={() => {
                                        handleDelete(celebrity._id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </Link>

                                  {/*
                                  <a
                                    href={`https://jatinmorwebsite-dev.netlify.app/celebrity/${celebrity._id}`}
                                    target="_blank"
                                  >
                                    <button
                                      style={{ color: "white" }}
                                      type="button"
                                      className="
                                            btn btn-success btn-sm
                                            waves-effect waves-light
                                            btn-table
                                            "
                                    >
                                      <CIcon icon={cilExternalLink} />
                                    </button>
                                  </a>
                                */}
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
                        {Math.min(
                          currentPage * itemPerPage,
                          celebritiesData.length
                        )}{" "}
                        of {celebritiesData.length} entries
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
                            celebritiesData.length - 1
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
                                celebritiesData.length - 1
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

export default Celebrities;
