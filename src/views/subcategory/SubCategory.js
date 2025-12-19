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
import { useBanner, useSubCategory } from "./subCategoryContext";

const SubCategory = () => {
  const navigate = useNavigate();
  const {
    banner,
    handlegetAllSubcategorys,
    setPage,
    setItemPerPage,
    handleDelete,
    setBannerType,
    bannertype,
    bannerId,
    itemPerPage,
    loading,
    page,
  } = useSubCategory();

  const tableHeadering = [
    "CreatedAt",
    "Name",
    "Category",
    "Subcategory",
    "Image",
    "Actions",
  ];
  let fetchBanner = banner?.category;

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
                        handlegetAllSubcategorys(page, Number(val), bannertype);
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
                    {tableHeadering.map((head) => (
                      <th> {head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {!loading && fetchBanner?.length === 0 && (
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
                    fetchBanner &&
                    fetchBanner.map((item, i) => (
                      <tr key={i}>
                        <td>{item?.createdAt}</td>
                        <td>{item?.name}</td>
                        <td>{item?.categoryId?.category || null}</td>
                        <td>{item?.subcategory || null}</td>

                   <td>
  <img
    src={item?.subcategorythumbnail?.url}
    alt=""
    style={{
      width: "80px",
      // height: "80px",
      objectFit: "cover",
      borderRadius: "6px",
    }}
  />
</td>

                        <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                            {/* <button
                              style={{
                                color: "white",
                                width: "90px",
                                fontWeight: "bold",
                                borderRadius: "6px"
                              }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={() => {
                                navigate(`/banner/update/${item._id}`);
                              }}
                            >
                              Edit
                            </button> */}
                            <button
                              style={{
                                color: "white",
                                background: "red",
                                width: "90px",
                                fontWeight: "bold",
                                borderRadius: "6px"
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
                  handlegetAllSubcategorys(value, itemPerPage, bannertype);
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
export default SubCategory;
