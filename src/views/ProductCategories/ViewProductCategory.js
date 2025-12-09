import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import swal from "sweetalert";

import { Link, useParams } from "react-router-dom";
import Button from '@mui/material/Button'
import { isAutheticated } from "../../auth";

function ViewProductCategory() {
  const [productCategory, setProductCategory] = useState([]);
  const { id } = useParams();
  const token = isAutheticated();

  const getProductCategory = useCallback(async () => {
    let res = await axios.get(`/api/productCategory/getOne/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProductCategory(res.data.productCategory);
  }, [token]);

  useEffect(() => {
    getProductCategory();
  }, [getProductCategory]);

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
              <h4 className="mb-3">productCategory</h4>
              <div className="page-title-box page-title-right d-flex align-items-center justify-content-between">
                <Link to="/product-categories">
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
                            <h5>{productCategory?._id}</h5>
                          </td>
                        </tr>
                        <tr>
                          <th>Name</th> <td>{productCategory?.name}</td>
                        </tr>

                        {productCategory.image && (
                          <tr>
                            <th>image</th>
                            <td>
                              {productCategory.image.map((i) => (
                                <img
                                  key={i._id}
                                  className="me-2"
                                  src={`${i?.url}`}
                                  width="50%"
                                  alt=""
                                />
                              ))}
                            </td>
                          </tr>
                        )}

                        <tr>
                          <th>Description</th>
                          <td>{productCategory?.description}</td>
                        </tr>

                        <tr>
                          <th>Created On</th>
                          <td>
                            {new Date(
                              `${productCategory?.createdAt}`
                            ).toDateString()}
                            <span>
                              {" "}
                              , {`${formatAMPM(productCategory?.createdAt)}`}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>Updated At</th>
                          <td>
                            {new Date(
                              `${productCategory?.updatedAt}`
                            ).toDateString()}
                            <span>
                              {" "}
                              , {`${formatAMPM(productCategory?.updatedAt)}`}
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

export default ViewProductCategory;
