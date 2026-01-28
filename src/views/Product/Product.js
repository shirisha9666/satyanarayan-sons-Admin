import {
  Button,
  Box,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "./ProductContenxt";

const Products = () => {
  const navigate = useNavigate()
  const {
    products,
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
    handlegetOneProduct,
    setSearchBtn,
    setSearchInput,
    productId,
    searchBtn,
    searchInput,
  } = useProduct();

  const tableHeadering = [
    "Product Name",
    "Category",
    "SubCategory",

    "Image",
    "Actions",
  ];
  let fetchProducts = products?.result;
  const btnStyle = (color) => ({
    backgroundColor: color,
    color: "#fff",
    fontWeight: "bold",
    textTransform: "none",
    borderRadius: "20px",
    padding: "8px 20px",
    "&:hover": {
      backgroundColor: color,
      opacity: 0.9,
    },
  });
  console.log("searchInput", searchInput);

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

                        handlegetAllProducts(
                          page,
                          Number(val),
                          searchBtn,
                          searchInput,
                        );
                        Wedding;
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
                      navigate("/product/add");
                    }}
                  >
                    Add New Product
                  </Button>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  sx={btnStyle("#37d488")}
                  onClick={() => {
                    setSearchBtn("");

                    handlegetAllProducts(page, itemPerPage, "", searchInput);
                  }}
                >
                  All
                </Button>
                <Button
                  sx={btnStyle("#D4AF37")}
                  onClick={() => {
                    setSearchBtn("Gold");

                    handlegetAllProducts(
                      page,
                      itemPerPage,
                      "Gold",
                      searchInput,
                    );
                  }}
                >
                  Gold
                </Button>
                <Button
                  sx={btnStyle("#B9F2FF")}
                  onClick={() => {
                    setSearchBtn("Diamond");

                    handlegetAllProducts(
                      page,
                      itemPerPage,
                      "Diamond",
                      searchInput,
                    );
                  }}
                >
                  Diamond
                </Button>
                <Button
                  sx={btnStyle("#7D3C98")}
                  onClick={() => {
                    setSearchBtn("Gemstones");
                    handlegetAllProducts(
                      page,
                      itemPerPage,
                      "Gemstones",
                      searchInput,
                    );
                  }}
                >
                  Gemstones
                </Button>
                <Button
                  sx={btnStyle("#A0522D")}
                  onClick={() => {
                    setSearchBtn("DailyWere");
                    handlegetAllProducts(
                      page,
                      itemPerPage,
                      "DailyWere",
                      searchInput,
                    );
                  }}
                >
                  Daily Wear
                </Button>
                <Button
                  sx={btnStyle("#8B0000")}
                  onClick={() => {
                    setSearchBtn("Wedding");
                    handlegetAllProducts(
                      page,
                      itemPerPage,
                      "Wedding",
                      searchInput,
                    );
                  }}
                >
                  Wedding
                </Button>
              </Stack>

              <div className="">
                <input
                  className="billing-search"
                  type="text"
                  placeholder="Search By Product Name"
                  value={searchInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchInput(val); // ✅ missing line

                    handlegetAllProducts(page, itemPerPage, searchBtn, val);
                  }}
                />
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
                        {" "}
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
                          {item?.productName}
                        </td>
                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.categoryId?.category || null}
                        </td>

                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          {item?.subcategoryId?.subcategory || null}
                        </td>

                        <td
                          style={{
                            verticalAlign: "middle",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={item?.productImage?.url}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 8,
                              display: "block",
                              margin: "0 auto",
                            }}
                            alt="Product"
                          />
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
                                await handlegetOneProduct(item._id);
                                navigate(`/product/update/${item._id}`);
                              }}
                            >
                              {productId === item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "Edit"
                              )}
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
                count={products?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);

                  handlegetAllProducts(
                    value, itemPerPage,
                    searchBtn,
                    searchInput,
                  );

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
export default Products;
