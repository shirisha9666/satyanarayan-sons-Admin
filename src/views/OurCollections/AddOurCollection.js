import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { isAutheticated } from "../../auth";
import { CFormSelect, CFormSwitch } from "@coreui/react";

const AddOurCollection = () => {
  const token = isAutheticated();
  const navigate = useNavigate();
  const [data, setData] = useState({
    image: [],
    imageURL: [],
    name: "",
  });

  const [loading, setLoading] = useState(false);

  const [imagesPreview, setImagesPreview] = useState([]);

  const handleSwitchChange = (e) => {
    setData((prev) => ({
      ...prev,
      setAsFeatured: !prev.setAsFeatured,
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === "image") {
      if (
        e.target.files[0]?.type === "image/jpeg" ||
        e.target.files[0]?.type === "image/png" ||
        e.target.files[0]?.type === "image/jpg"
      ) {
        if (imagesPreview.length > 1) {
          swal({
            title: "Warning",
            text: "maximum 1 image Upload ",
            icon: "error",
            button: "Close",
            dangerMode: true,
          });
          return;
        }
        // only for file preview------------------------------------
        const files = Array.from(e.target.files);
        files.forEach((file) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (reader.readyState === 2) {
              setImagesPreview((old) => [...old, reader.result]);
            }
          };

          reader.readAsDataURL(file);
        });
        // -----------------------------------------------------------------------------

        setData((prev) => ({
          ...prev,

          image: [...data.image, ...e.target.files],
        }));
        return;
      } else {
        swal({
          title: "Warning",
          text: "Upload jpg, jpeg, png only.",
          icon: "error",
          button: "Close",
          dangerMode: true,
        });
        setData((prev) => ({
          ...prev,
          imageURL: "",
          image: "",
        }));
        e.target.value = null;
        return;
      }
    }
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  console.log(data);
  const handleSubmit = () => {
    if (data.name.trim() === "" || data.image === "") {
      swal({
        title: "Warning",
        text: "Fill all mandatory fields",
        icon: "error",
        button: "Close",
        dangerMode: true,
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);

    data.image.forEach((Singleimage) => {
      formData.append("image", Singleimage);
    });

    axios
      .post(`/api/ourCollection/create/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/formdata",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        swal({
          title: "Added",
          text: " Banner added successfully!",
          icon: "success",
          button: "ok",
        });
        setLoading(false);
        navigate("/our-collections", { replace: true });
      })
      .catch((err) => {
        setLoading(false);
        const message = err.response?.data?.message
          ? err.response?.data?.message
          : "Something went wrong!";
        swal({
          title: "Warning",
          text: message,
          icon: "error",
          button: "Retry",
          dangerMode: true,
        });
      });
  };

  return (
    <div className="container">
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
              Add Our Collection Image
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <h4 className="mb-0"></h4>
            </div>

            <div className="page-title-right">
              <Button
                variant="contained"
                color="primary"
                style={{
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  textTransform: "capitalize",
                  marginRight: "5px",
                }}
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                {loading ? "Loading" : "Save"}
              </Button>
              <Link to="/our-collections">
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
      </div>
      <div className="row">
        <div className="col-lg-12 col-md-12  col-sm-12 my-1">
          <div className="card h-100">
            <div className="card-body px-5">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Our Collection Name*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={data.name}
                  maxLength={25}
                  onChange={(e) => handleChange(e)}
                />
                {data.name ? (
                  <>
                    <small className="charLeft mt-4 fst-italic">
                      {25 - data.name.length} characters left
                    </small>
                  </>
                ) : (
                  <></>
                )}{" "}
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Our Collection Image*
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleChange(e)}
                />
                <p className="pt-1 pl-2 text-secondary">
                  Upload jpg, jpeg and png only*
                </p>
              </div>
              <div>
                {/*<strong className="fs-6 fst-italic">
                  *Please Upload maximum four images
                </strong>*/}
              </div>

              <div id="ourCollectionImage" className="w-25 d-flex">
                {imagesPreview.map((image, index) => (
                  <img
                    className=" w-50 p-1 "
                    key={index}
                    src={image}
                    alt="our Collection Preview"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOurCollection;
