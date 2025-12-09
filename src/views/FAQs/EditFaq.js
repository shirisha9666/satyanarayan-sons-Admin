import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";
import { isAutheticated } from "../../auth";
import { CFormSelect, CFormSwitch } from "@coreui/react";

const EditFaq = () => {
  const id = useParams()?.id;

  const token = isAutheticated();
  const navigate = useNavigate();
  const [data, setData] = useState({
    question: "",
    answer: "",
  });

  const [loading, setLoading] = useState(false);

  //get Faq
  const getFaq = async () => {
    axios
      .get(`/api/Faq/getOne/${id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data, "res");
        setData((prev) => ({
          ...prev,
          question: res.data.faq.question,
          answer: res.data.faq.answer,
        }));
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getFaq();
  }, []);

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (data.question.trim() === "" || data.answer === "") {
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
    formData.append("question", data.question);
    formData.append("answer", data.answer);

    axios
      .put(`/api/Faq/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/formdata",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        swal({
          title: "Updated",
          text: "Faq Updated successfully!",
          icon: "success",
          button: "ok",
        });
        setLoading(false);
        navigate("/faqs", { replace: true });
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
              Edit Faq
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
              <Link to="/faqs">
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
                  Question*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="question"
                  value={data.question}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="answer" className="form-label">
                  Answer*
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="answer"
                  value={data.answer}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFaq;
