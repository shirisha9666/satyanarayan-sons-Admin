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
import { useBanner } from "./bannerContext";

const Banners = () => {
  const navigate = useNavigate();
  const {
    banner,
    getHomebanners,
    setPage,
    setItemPerPage,
    handleDelete,
    setBannerType,
    bannertype,
    bannerId,
    itemPerPage,
    loading,
    page,
  } = useBanner();

  const tableHeadering = [
    "CreatedAt",
    "Name",
    "Type",
    "SubTitle",
    "Content",
    "Image",
    "Actions",
  ];
  let fetchBanner = banner?.result;
  console.log("fetchBanner", banner);

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
                        getHomebanners(page, Number(val), bannertype);
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
                      navigate("/banner/add");
                    }}
                  >
                    Add New Banner
                  </Button>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <Button
                  onClick={() => {
                    setBannerType("Home Banner");

                    getHomebanners(page, itemPerPage, "Home Banner");
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
                    getHomebanners(page, itemPerPage, "Campaign banner");
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
                        <td>{item?.bannerType || null}</td>

                        <td>{item?.subtitle}</td>
                        <td>{item?.content}</td>

                        <td>
                          <img
                            className="me-2"
                            src={item?.banner?.url}
                            width="100"
                            alt=""
                          />
                        </td>

                        <td style={{ display: "flex", gap: "10px" }}>
                          <button
                            style={{
                              color: "white",
                            }}
                            type="button"
                            className="
                                             btn btn-primary
                                           waves-effect waves-light
                                           btn-table
                                       
                                         "
                            onClick={() => {
                              navigate(
                                `/banner/update/${item._id}`
                              );
                            }}
                          >
                            Edit
                          </button>
                          <button
                            style={{
                              color: "white",

                              background: "red",
                            }}
                            type="button"
                            className="
                                             btn  btn-sm
                                           waves-effect waves-light
                                           btn-table
                                       
                                         "
                            onClick={() => handleDelete(item._id)}
                          >
                            {bannerId === item._id ? "Deleting..." : "Delete"}
                          </button>
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
                  getHomebanners(value, itemPerPage, bannertype);
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
export default Banners;
