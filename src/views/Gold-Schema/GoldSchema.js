import {
  Button,
  Box,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoldSchema } from "./GoldSchemaContext";

const GoldSchema = () => {
  const navigate = useNavigate();
  const {
    banner,
    handlegetAllProducts,
    setPage,
    setItemPerPage,
    handleDelete,
    setBannerType,
    bannertype,
    bannerId,
    itemPerPage,
    loading,
    page,
  } = useGoldSchema();

  const tableHeadering = [
    "Scheme ID",
    "Scheme Name",
    "Monthly Installment",

    "Months",
    "Members",
    "Action ",
  ];
  // let fetchProducts = banner?.result;


  const fetchProducts = [
  {
    schemeId: "GS-001",
    schemeName: "Golden Savings Plan",
    monthlyInstallment: 2000,
    months: 11,
    members: 120,
  },
  {
    schemeId: "GS-002",
    schemeName: "Shree Gold Scheme",
    monthlyInstallment: 3000,
    months: 12,
    members: 85,
  },
  {
    schemeId: "GS-003",
    schemeName: "Lakshmi Gold Scheme",
    monthlyInstallment: 1500,
    months: 10,
    members: 210,
  },
  {
    schemeId: "GS-004",
    schemeName: "Premium Gold Plus",
    monthlyInstallment: 5000,
    months: 12,
    members: 45,
  },
  {
    schemeId: "GS-005",
    schemeName: "Family Gold Savings",
    monthlyInstallment: 2500,
    months: 11,
    members: 160,
  },
];


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
                        handlegetAllProducts(page, Number(val), bannertype);
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
                      navigate("/gold-schemes/add");
                    }}
                  >
                    Add New Scheme
                  </Button>
                </div>
              </div>
              {/* <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <Button
                  onClick={() => {
                    setBannerType("Home Banner");

                    handlegetAllProducts(page, itemPerPage, "Home Banner");
                  }}
                  variant="contained"
                  style={{
                    background: `${bannertype === "Home Banner" ? "#D4AF37" : "#1B1A1A"}`,
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "8px 20px",
                    borderRadius: "10px",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                >
                  Home Banner
                </Button>

                <Button
                  onClick={() => {
                    setBannerType("Campaign banner");
                    handlegetAllProducts(page, itemPerPage, "Campaign banner");
                  }}
                  variant="contained"
                  style={{
                    background: `${bannertype === "Campaign banner" ? "#D4AF37" : "#1B1A1A"}`,
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "8px 20px",
                    borderRadius: "10px",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                >
                  Campaign Banner
                </Button>
              </div> */}
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
                          {item?.schemeId}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.schemeName}
                        </td>

                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.monthlyInstallment}
                        </td>
                           

                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                        {item.months}
                        </td>
                         <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                        {item.members}
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
                              onClick={() => {
                                navigate(`/banner/update/${item._id}`);
                              }}
                            >
                              Edit
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
                              {bannerId === item._id ? "Deleting..." : "Delete"}
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
                count={banner?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllProducts(value, itemPerPage, bannertype);
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
export default GoldSchema;
