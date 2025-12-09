import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from 'sweetalert'
import Button from '@mui/material/Button'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAutheticated } from "../../auth";
import CIcon from "@coreui/icons-react";
import {
  cibCoveralls,
  cibDiaspora,
  cilExternalLink,
  cilPencil,
  cilStar,
  cilStarHalf,
  cilTrash,
} from "@coreui/icons";



const HomeBanners = () => {
  const token = isAutheticated();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [homeBannersData, setHomeBannersData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [showData, setShowData] = useState(homeBannersData);
    const bannerHeaders=["HomeBanner Name","Banner","Added On","Actions"]

  const handleShowEntries = (e) => {
    setCurrentPage(1);
    setItemPerPage(e.target.value);
  };

  const getHomeBannersData = async (page=1) => {
    try {
        setLoading(false)
      
    const resp = await axios.get(`/api/homeBanner/getAll`, {
      params: {
        page: page,   
        limit: itemPerPage    
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      const result=resp?.data?.result
      setHomeBannersData(result)
    } catch (error) {
      console.log("eroror.getHomeBannersData",error)
      const message=error.response?.data?.message
      console.log("message",message)
    }finally{
      setLoading(false)
    }
    
  };

  useEffect(() => {
    getHomeBannersData();
  }, []);


  const handleDelete = (id) => {
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
          .delete(`/api/homeBanner/delete/${id}`, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            swal({
              title: "Deleted",
              text: "homeBanner Deleted successfully!",
              icon: "success",
              button: "ok",
            });
            setSuccess((prev) => !prev);
          })
          .catch((err) => {
            swal({
              title: "Warning",
              text: "Something went wrong!",
              icon: "error",
              button: "Retry",
              dangerMode: true,
            });
          });
      }
    });
  };

  // search
  const handleSearch = (e) => {
    let value = e.target.value;
    let result = [];
    if (value.length > 0) {
      result = homeBannersData.filter((data) => {
        return data.name.toLowerCase().includes(value.toLowerCase());
      });
      setShowData(result);
    } else {
      setShowData(homeBannersData);
    }
  };

  console.log("homeBannersData",homeBannersData);

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
                  homeBanners
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
                    onClick={() => {
                      navigate("/home-banner/add", { replace: true });
                    }}
                  >
                    Add homeBanner
                  </Button>
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
                            name=""
                            value={currentPage}
                            onChange={(e) => handleShowEntries(e)}
                            className="
                                select-w
                                custom-select custom-select-sm
                                form-control form-control-sm
                              "
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
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
                        
                          {bannerHeaders.map((header)=><th className="text-start">{header}</th>)}
                        
                        </tr>
                      </thead>
                      <tbody>
                        {!loading && homeBannersData.length === 0 && (
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
                          homeBannersData.map((homeBanner, i) => {
                            console.log("homeBanner",homeBanner)
                            return (
                              <tr key={i}>
                                <td className="text-start">
                                  {` ${homeBanner.name}`}
                                </td>
                                <th>
                                  <img src= {homeBanner?.banner?.url} alt="home banner" style={{height:"50px",width:"100px"}}/>
                               
                                </th>

                                <td className="text-start">
                                 {homeBanner?.createdAt}
                                </td>

                                <td className="text-start">
                                  <Link
                                    to={"#"}
                                    style={{
                                      marginRight: "1rem",
                                    }}
                                  >
                                    <button
                                      style={{ color: "white" }}
                                      type="button"
                                      className="
                                    btn btn-danger btn-sm
                                    waves-effect waves-light
                                    btn-table
                                    mt-1
                                    mx-1
                                    
                                  "
                                      onClick={() => {
                                        handleDelete(homeBanner._id);
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
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

export default HomeBanners;
