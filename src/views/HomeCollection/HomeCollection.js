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
import { useHomeCollection } from "./HomeCollectionContext";

const HomeCollection = () => {
  const navigate = useNavigate();
  const {
    banner,
    handlegetAllData,
    setPage,
    setItemPerPage,
    handleDelete,
    setBannerType,
    bannertype,
    bannerId,
    itemPerPage,
    viewBannerId,
    loading,
    page,
    handleOneBanner,
  } = useHomeCollection();

  const tableHeadering = [
    // "CreatedAt",
    "Name",
    "Type",
    "MediaType",
    "status",
    "Image",
    "Actions",
  ];
  let fetchBanner = banner?.result;

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
                        handlegetAllData(page, Number(val), bannertype);
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
                {/* <div>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textTransform: "capitalize",
                    }}
                    onClick={() => {
                      navigate("/home-collections/add");
                    }}
                  >
                    Add
          
                  </Button>
                </div> */}
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <Button
                  onClick={() => {
                    setBannerType("New_Arrivals");

                    handlegetAllData(page, itemPerPage, "New_Arrivals");
                  }}
                  variant="contained"
                  style={{
                    background: `${
                      bannertype === "New_Arrivals" ? "#D4AF37" : "#1B1A1A"
                    }`,
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "8px 20px",
                    borderRadius: "10px",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                >
                  New_Arrivals
                </Button>

                <Button
                  onClick={() => {
                    setBannerType("Trendy");
                    handlegetAllData(page, itemPerPage, "Trendy");
                  }}
                  variant="contained"
                  style={{
                    background: `${
                      bannertype === "Trendy" ? "#D4AF37" : "#648181"
                    }`,
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "8px 20px",
                    borderRadius: "10px",
                    textTransform: "none",
                    cursor: "pointer",
                  }}
                >
                 Trendy
                </Button>

               <Button
  onClick={() => {
    setBannerType("Instagram");
    handlegetAllData(page, itemPerPage, "Instagram");
  }}
  variant="contained"
  style={{
    background:
      bannertype === "Instagram" ? "#D4AF37" : "#E1306C",
    color: "#fff",
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "10px",
    textTransform: "none",
    cursor: "pointer",
  }}
>
  Instagram
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
                        {/* <td>{item?.createdAt}</td> */}
                        <td>{item?.name}</td>
                        <td>{item?.selectedType || null}</td>

                        <td>{item?.mediaType}</td>
                        <td>{item?.status}</td>

                        <td>
                          {item?.Thumbnail?.url ? (
                            item.Thumbnail?.url?.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video
                                src={item.Thumbnail.url}
                                width="100"
                                height="60"
                                muted
                                loop
                                autoPlay
                                playsInline
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            ) : (
                              <img
                                src={item.Thumbnail.url}
                                width="100"
                                height="60"
                                alt=""
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            )
                          ) : (
                            "—"
                          )}
                        </td>

                        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                          <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                            <button
                              style={{ color: "white" }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={async () => {
                                await handleOneBanner(item._id);
                                navigate(`/home-collections/update/${item._id}`);
                              }}
                            >
                              {viewBannerId === item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "Edit"
                              )}
                            </button>
                            <button
                              style={{ color: "white", background: "red" }}
                              type="button"
                              className="btn btn-sm waves-effect waves-light btn-table"
                              onClick={() => handleDelete(item._id)}
                            >
                              {bannerId === item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
{/* 
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Pagination
                count={banner?.totalPages}
                page={page}
                onChange={(e, value) => {
                  setPage(value);
                  handlegetAllData(value, itemPerPage, bannertype);
                }}
                color="primary"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeCollection;
