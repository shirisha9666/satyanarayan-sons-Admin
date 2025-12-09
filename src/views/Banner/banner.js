import React, { useState, useEffect } from "react";
import axios from "axios";
import { isAutheticated } from "src/auth";
import {
  Button,
  Box,
  IconButton,
  Modal,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ClipLoader } from "react-spinners";
import swal from "sweetalert";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteSharpIcon from "@mui/icons-material/DeleteSharp";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useSeries } from "../series/SeriesContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "0.5rem",
  boxShadow: 24,
  width: "500px",
};

const Banners = () => {
  const token = isAutheticated();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(true); // for loading state
  // const [isUpdate, setIsUpdate] = useState(false); // for edit state
  const [saveLoding, setSaveLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [genreId, setGenreId] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [error, setError] = useState("");
  const [bannerId, setBannerId] = useState("");
  const [banner, setBanner] = useState([]);
  const [oneBaner, setOneBanner] = useState([]);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [olderBannerName, setOlderBaannerName] = useState("");
  const [olderImage, setOlderImage] = useState("");
  const [bannerDetails, setBannerDetails] = useState({
    name: "",
    subtitle: "",
    content: "",
  });
  const { genres } = useSeries();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // setUpdating(false);
    setEdit(false);

    setGenreId("");
    setBannerId("");
    setOlderImage("");
    setBannerImage("");
  };
  const tableHeadering = [
    "createdAt",
    "Name",
    "SubTitle",
    "Content",
    "Image",
    "Actions",
  ];

  const getHomebanners = async (page = 1, itemPerPage) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/homeBanner/getAll/", {
        params: {
          page,
          limit: itemPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBanner(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };
  const getOneHomebanner = async (bannerId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/homeBanner/getOne/${bannerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOneBanner(response?.data);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };

  // }, [token, banner]);

  const handleEditClick = (_id, bannerName, bannerImage) => {
    setOpen(true);
    setOlderImage(bannerImage);
    setGenreId(genreId);

    setBannerId(_id);
    setOlderBaannerName(bannerName);
    setEdit(true);
    // setUpdating(false);
  };

  const handleUpdate = () => {
    setUpdating(false);
    const formData = new FormData();
    formData.append("generId", genreId);

    formData.append("bannerImage", bannerImage);

    formData.append("olderImage", JSON.stringify(olderImage));

    axios
      .patch(`/api/banner/update/${bannerId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // setUpdating(true);
        // setIsUpdate(false);
        handleClose();
        setBannerId("");
        setGenreId("");

        setBannerImage("");
        setOlderImage("");
        setUpdating(true);
        setEdit(false);
        swal({
          title: "Congratulations!!",
          text: "The banner was updated successfully!",
          icon: "success",
          button: "OK",
        });
        getHomebanners(page, itemPerPage);
      })
      .catch((err) => {
        swal({
          title: "Sorry, please try again",
          text: err,
          icon: "error",
          button: "Retry",
          dangerMode: true,
        });
        setUpdating(true);
      });
  };

  const handleDelete = (_id) => {
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
          .delete(`/api/homeBanner/delete/${_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            swal({
              title: "Congratulations!!",
              text: "The banner was deleted successfully!",
              icon: "success",
              button: "OK",
            });
            getHomebanners(page, itemPerPage);
            // getCategories(); // Refresh the category list after deleting
          })
          .catch((err) => {
            swal({
              title: "",
              text: "Something went wrong!",
              icon: "error",
              button: "Retry",
              dangerMode: true,
            });
          });
      }
    });
  };

  const handelChange = (e) => {
    setBannerDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveBanner = async () => {
    setSaveLoading(false);
    setLoading(true);
    const formData = new FormData();
    formData.append("name", bannerDetails.name);
    formData.append("subtitle", bannerDetails.subtitle);
    formData.append("content", bannerDetails.content);
    formData.append("banner", bannerImage);

    console.log("bannerDetails", bannerDetails);

    axios
      .post("/api/homeBanner/create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          setOpen(false);
          setLoading(false);
          setSaveLoading(true);
          setGenreId("");

          setBannerImage("");
          setOlderImage("");
          getHomebanners(page,itemPerPage)
          swal({
            title: "Added",
            text: "New Banner added successfully!",
            icon: "success",
            button: "OK",
          });
        }
      })
      .catch((error) => {
        setSaveLoading(true);
        swal({
          title: error,
          text: "something went wrong",
          icon: "error",
          button: "Retry",
          dangerMode: true,
        });
      });
  };

  const getPageCount = () => {
    return Math.max(1, Math.ceil(banner?.length / itemPerPage));
  };

  const handleFileChange = (e) => {
    const files = e.target.files[0];

    // Check file types and append to selectedFiles
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(files.type)) {
      setBannerImage(files);
    }
  };
  const handeldeleteImage = () => {
    setBannerImage("");
  };
  let fetchBanner = banner?.homeBanner;

  useEffect(() => {
    getHomebanners(page, itemPerPage);
  }, []);

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
                  Banners
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
                    onClick={handleOpen}
                    // onClick={() => {
                    //   navigate("/testimonial/new", { replace: true });
                    // }}
                  >
                    Add New Banner
                  </Button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Box p={2} display={"flex"}>
                        <Typography
                          id="modal-modal-title"
                          variant="body"
                          component="h2"
                          flex={1}
                        >
                          Banner Name
                        </Typography>

                        <IconButton onClick={() => handleClose()}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <hr />
                      <Grid
                        container
                        spacing={2}
                        style={{ marginTop: "10px", padding: "10px" }}
                      >
                        {/* Name */}
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <TextField
                              value={bannerDetails.name}
                              onChange={handelChange}
                              label="Name"
                              name="name"
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>

                        {/* Subtitle */}
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <TextField
                              value={bannerDetails.subtitle}
                              onChange={handelChange}
                              label="Subtitle"
                              name="subtitle"
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>

                        {/* Content */}
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <TextField
                              value={bannerDetails.content}
                              onChange={handelChange}
                              label="Content"
                              name="content"
                              variant="outlined"
                              multiline // ⭐ Makes textarea
                              rows={5}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Box
                        style={{
                          padding: "1rem",
                        }}
                      >
                        <label htmlFor="upload-Image">
                          <TextField
                            style={{
                              display: "none",
                              width: "350px",
                              height: "350px",
                              borderRadius: "10%",
                            }}
                            fullWidth
                            id="upload-Image"
                            type="file"
                            accept=".jpg , .png ,.jpeg"
                            label="file"
                            variant="outlined"
                            onChange={(e) => handleFileChange(e)}
                          />
                          <Box
                            style={{ borderRadius: "10%" }}
                            sx={{
                              margin: "1rem 0rem",
                              cursor: "pointer",
                              width: "140px",
                              height: "140px",
                              border: "2px solid grey",
                              // borderRadius: '50%',

                              "&:hover": {
                                background: "rgba(112,112,112,0.5)",
                              },
                            }}
                          >
                            <CloudUploadIcon
                              style={{
                                color: "grey",
                                margin: "auto",
                                fontSize: "5rem",
                              }}
                              fontSize="large"
                            />
                          </Box>
                        </label>
                        {bannerImage && (
                          <Box>
                            <img
                              src={URL.createObjectURL(bannerImage)}
                              alt="bannerImage"
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "1rem",
                                marginLeft: "1rem",
                              }}
                            />
                            <DeleteSharpIcon
                              onClick={() => handeldeleteImage()}
                              fontSize="small"
                              sx={{
                                color: "white",
                                position: "absolute",
                                cursor: "pointer",
                                padding: "0.2rem",
                                background: "black",
                                borderRadius: "50%",
                              }}
                            />
                          </Box>
                        )}
                        {olderImage && (
                          <Box>
                            <img
                              src={olderImage?.secure_url}
                              alt="bannerImage"
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: "1rem",
                                marginLeft: "1rem",
                              }}
                            />
                            <DeleteSharpIcon
                              onClick={() => setOlderImage("")}
                              fontSize="small"
                              sx={{
                                color: "white",
                                position: "absolute",
                                cursor: "pointer",
                                padding: "0.2rem",
                                background: "black",
                                borderRadius: "50%",
                              }}
                            />
                          </Box>
                        )}
                      </Box>

                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <p className="pt-1 pl-2 text-secondary">
                        Upload jpg, jpeg and png only*
                      </p>

                      <Box
                        p={2}
                        display={"flex"}
                        justifyContent={"right"}
                        // width={"500px"}
                      >
                        {!edit && (
                          <button
                            style={{
                              color: "white",
                              marginRight: "1rem",
                            }}
                            onClick={() => handleSaveBanner()}
                            type="button"
                            className="
                                      btn btn-primary btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                          >
                            <ClipLoader loading={!saveLoding} size={18} />
                            {saveLoding && "Save"}
                          </button>
                        )}
                        {edit && (
                          <button
                            style={{
                              color: "white",
                              marginRight: "1rem",
                            }}
                            onClick={() => handleUpdate()}
                            type="button"
                            className="
                                      btn btn-primary btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                          >
                            <ClipLoader loading={!updating} size={18} />
                            {updating && "update"}
                          </button>
                        )}
                        <button
                          style={{
                            color: "black",
                            marginRight: "1rem",
                            background: "grey",
                          }}
                          onClick={() => setOpen(false)}
                          type="button"
                          className="
                                      btn  btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mx-1
                                    mt-1
                                  "
                        >
                          Close
                        </button>
                      </Box>
                    </Box>
                  </Modal>
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
                            onChange={(e) => {
                              let val = e.target.value;
                              setItemPerPage(Number(val));
                              getHomebanners(page, Number(val));
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
                                {/* <button 
                                  style={{
                                    color: "white",
                                 
                                  }}
                                  type="button"
                                  className="
                                      btn btn-primary
                                    waves-effect waves-light
                                    btn-table
                                
                                  "
                                  onClick={() =>
                                    handleEditClick(
                                      item._id,
                                      item.bannerName,
                                      item.bannerImage
                                   
                                    )
                                  }
                                >
                                  Edit
                                </button> */}
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
                                  Delete
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
                        getHomebanners(value, itemPerPage);
                      }}
                      color="primary"
                    />
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

export default Banners;
