import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import swal from "sweetalert";

import { Link, useParams } from "react-router-dom";

import Button from '@mui/material/Button'
import { isAutheticated } from "../../auth";

function ViewCelebrity() {
  const [celebrity, setCelebrity] = useState([]);
  const { id } = useParams();
  const token = isAutheticated();

  const getCelebrity = useCallback(async () => {
    let res = await axios.get(`/api/celebrity/getOne/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCelebrity(res.data.celebrity);
  }, [token]);

  useEffect(() => {
    getCelebrity();
  }, [getCelebrity]);

  //change time formate
  function formatAMPM(date) {
    var hours = new Date(date).getHours();
    var minutes = new Date(date).getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  return (
    <div className=" main-content">
      <div className="  my-3 page-content">
        <div className="container-fluid">
          {/* <!-- start page title --> */}
          <div className="row">
            <div className="col-12">
              <h4 className="mb-3">Celebrity</h4>
              <div className="page-title-box page-title-right d-flex align-items-center justify-content-between">
                <Link to="/celebrities">
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    Back
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* <!-- end page title --> */}

          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row ml-0 mr-0  mb-10"></div>
                  <div className="table-responsive table-shoot">
                    <table className="table table-centered table-nowrap mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th>Id</th>{" "}
                          <td>
                            <h5>{celebrity?._id}</h5>
                          </td>
                        </tr>
                        <tr>
                          <th>Name</th> <td>{celebrity?.name}</td>
                        </tr>

                        {celebrity.image && (
                          <tr>
                            <th>image</th>
                            <td>
                              {celebrity.image.map((i) => (
                                <img
                                  key={i._id}
                                  className="me-2"
                                  src={`${i?.url}`}
                                  width="100%"
                                  alt=""
                                />
                              ))}
                            </td>
                          </tr>
                        )}

                        <tr>
                          <th>Featured</th>
                          <td>{celebrity?.setAsFeatured ? "true" : "false"}</td>
                        </tr>

                        <tr>
                          <th>Created On</th>
                          <td>
                            {new Date(`${celebrity?.createdAt}`).toDateString()}
                            <span>
                              {" "}
                              , {`${formatAMPM(celebrity?.createdAt)}`}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>Updated At</th>
                          <td>
                            {new Date(`${celebrity?.updatedAt}`).toDateString()}
                            <span>
                              {" "}
                              , {`${formatAMPM(celebrity?.updatedAt)}`}
                            </span>
                          </td>
                        </tr>
                      </thead>
                      <tbody></tbody>
                    </table>
                  </div>

                  {/* <!-- end table-responsive --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- container-fluid --> */}
      </div>
    </div>
  );
}

export default ViewCelebrity;
