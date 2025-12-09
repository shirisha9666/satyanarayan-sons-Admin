import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { isAutheticated } from "../../auth";
import { CFormSelect, CFormSwitch } from "@coreui/react";

const EditCelebrity = () => {
  const id = useParams()?.id;

  const token = isAutheticated();
  const navigate = useNavigate();
  const [data, setData] = useState({
    image: [],
    imageURL: [],
    name: "",
    setAsFeatured: true,
  });

  const [loading, setLoading] = useState(false);

  const [imagesPreview, setImagesPreview] = useState([]);
  //get Celebrity
  const getCelebrity = async () => {
    axios
      .get(`/api/celebrity/getOne/${id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data?.product?.image)
        // if (res.data?.celebrity?.image) {
        //     res.data?.celebrity?.image.map(item => {
        //     })

        // }

        // setImagesPreview(res.data?.celebrity?.image);
        // setImage preview for each image in celebrity

        res.data?.celebrity?.image?.map((item) => {
          setImagesPreview((old) => [...old, item.url]);
        });
        // set data for each field but clear the image field
        setData((prev) => ({
          ...prev,
          ...res.data?.celebrity,
        }));
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getCelebrity();
  }, []);

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
        if (imagesPreview.length > 3) {
          swal({
            title: "Warning",
            text: "maximum Four image Upload ",
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
    formData.append("setAsFeatured", data.setAsFeatured);

    data.image.forEach((Singleimage) => {
      formData.append("image", Singleimage);
    });

    axios
      .put(`/api/celebrity/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/formdata",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        swal({
          title: "Updated",
          text: "Celebrity Updated successfully!",
          icon: "success",
          button: "ok",
        });
        setLoading(false);
        navigate("/celebrities", { replace: true });
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
              Edit Celebrity
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
                {loading ? "Loading" : "Edit"}
              </Button>
              <Link to="/celebrities">
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
                  Name*
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
                  Celebrity Image*
                </label>
              </div>

              {imagesPreview.length > 0 && (
                <div id="createCelebrityFormImage" className="w-25 d-flex">
                  {imagesPreview.map((image, index) => (
                    <img
                      className=" w-100 p-1 "
                      key={index}
                      src={image}
                      alt="Celebrity Preview"
                    />
                  ))}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="setAsFeatured" className="form-label">
                  Set as Featured
                </label>
                <CFormSwitch
                  id="setAsFeatured"
                  checked={data.setAsFeatured}
                  onChange={handleSwitchChange}
                ></CFormSwitch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCelebrity;
