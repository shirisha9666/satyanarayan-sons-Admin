import {
  Button,
  Box,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoldRate } from "./GoldRateContext";

const GoldRate = () => {
  const navigate = useNavigate();
  const {
    handlegeOnegoldRate,
    goldRate,
    handlegetAllProducts,
    setPage,
    setItemPerPage,
    handleDelete,
    goldRateeditId,
    setBannerType,
    bannertype,
    goldRateId,
    itemPerPage,
    loading,
    page,
  } = useGoldRate();

  const tableHeadering = ["Label", "Rate", "Unit", "Created", "Action "];
  let fetchProducts = goldRate?.result;

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-body">
            <div className="row ml-0 mr-0 mb-10">
              <div className="col-sm-12 col-md-12 d-flex justify-content-between align-items-center ">
                <div className="dataTables_length w-50">
                  <label className="w-100">
                    Show
                    <select
                      style={{ width: "10%" }}
                      onChange={(e) => {
                        let val = e.target.value;
                        setItemPerPage(Number(val));
                        handlegetAllProducts(page, Number(val));
                      }}
                      className="
                                       select-w
                                       custom-select custom-select-sm
                                       form-control form-control-sm
                                     "
                    >
                      <option value="10">10</option>
                      <option value="2">2</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                    entries
                  </label>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textTransform: "capitalize",
                    }}
                    onClick={() => {
                      navigate("/gold-rates/add");
                    }}
                  >
                    Add New Gold Rate
                  </Button>
                </div>
              </div>
            </div>

            <div className="table-responsive table-shoot mt-3">
              <table
                className="table table-centered table-nowrap"
                style={{ border: "1px solid", verticalAlign: "middle" }}
              >
                <thead
                  className="thead-info"
                  style={{ background: "rgb(140, 213, 213)" }}
                >
                  <tr>
                    {tableHeadering.map((head) => (
                      <th
                        style={{ verticalAlign: "middle", textAlign: "center" }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!loading && fetchProducts?.length === 0 && (
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
                    fetchProducts &&
                    fetchProducts.map((item, i) => (
                      <tr key={i} style={{ verticalAlign: "middle" }}>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.lable}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          ₹{item?.rate}
                        </td>

                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.unit}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.createdAt}
                        </td>

                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <button
                              style={{
                                color: "white",
                                width: "90px",
                                fontWeight: "bold",
                                borderRadius: "6px",
                              }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={async () => {
                                await handlegeOnegoldRate(item._id);
                                navigate(`/gold-rates/update/${item._id}`);
                              }}
                            >
                              {goldRateeditId===item._id ? <CircularProgress size={25}/> : "Edit"}
                            </button>
                            <button
                              style={{
                                color: "white",
                                background: "red",
                                width: "90px",
                                fontWeight: "bold",
                                borderRadius: "6px",
                              }}
                              type="button"
                              className="btn btn-sm waves-effect waves-light btn-table"
                              onClick={() => handleDelete(item._id)}
                            >
                              {goldRateId === item._id
                                ? <CircularProgress size={25}/>
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "right" }}>
              <Pagination
                count={goldRate?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllProducts(value, itemPerPage);
                }}
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GoldRate;
