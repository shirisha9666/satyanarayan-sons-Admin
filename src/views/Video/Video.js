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
import { useVideo } from "./VideoContext";

const VideoSection = () => {
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
  } = useVideo();

  const tableHeadering = [

    "Video",

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
                <h3 className="text-lg font-semibold text-gray-800">
                  Video Section
              
                </h3>
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
                      navigate("/video/add");
                    }}
                  >
                    Add
                  </Button>
                </div> */}
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
                      <th className={head === "Actions" ? "text-center" : ""}>
                        {" "}
                        {head}
                      </th>
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
                        {/* <td>{item?.status}</td> */}

                        <td>
                          <video
                            src={item.video.url}
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
                          {/* {item?.video?.url ? (
                            item.video?.url?.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video
                                src={item.video.url}
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
                          )} */}
                        </td>

                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <button
                              style={{ color: "white" }}
                              type="button"
                              className="btn btn-primary waves-effect waves-light btn-table"
                              onClick={async () => {
                                await handleOneBanner(item._id);
                                navigate(
                                  `/video/update/${item._id}`
                                );
                              }}
                            >
                              {viewBannerId === item._id ? (
                                <CircularProgress size={25} />
                              ) : (
                                "Edit"
                              )}
                            </button>
                            {/* <button
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
                            </button> */}
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
export default VideoSection;
