import axios from "axios";
import React, { useEffect, useState } from "react";

import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { isAutheticated } from "../../auth";


function Address() {
  const token = isAutheticated();
  const [loading, setLoading] = useState(false);
  // const [company, setCompany] = useState('')
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  //   const [gstin, setGSTIN] = useState("");

  useEffect(() => {
    async function getConfiguration() {
      const configDetails = await axios.get(`/api/config`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      configDetails.data.result.map((item) => {
        item.address.map((el) => {
          setAddressLine1(el.addressLine1);
          setAddressLine2(el.addressLine2);
          setCity(el.city);
          setState(el.state);
          setCountry(el.country);
          setPincode(el.pincode);
          setWebsite(el.website);
          setContact(el.contact);
          setEmail(el.email);
          //   setGSTIN(el?.gstin);
        });
      });
    }
    getConfiguration();
  }, []);
  async function handelChange(e) {
    if (e.target.name.toLowerCase() === "address line 1") {
      setAddressLine1(e.target.value);
    } else if (e.target.name.toLowerCase() === "address line 2") {
      setAddressLine2(e.target.value);
    } else if (e.target.name.toLowerCase() === "city") {
      setCity(e.target.value);
    } else if (e.target.name.toLowerCase() === "state") {
      setState(e.target.value);
    } else if (e.target.name.toLowerCase() === "country") {
      setCountry(e.target.value);
    } else if (e.target.name.toLowerCase() === "pincode") {
      setPincode(e.target.value);
    } else if (e.target.name.toLowerCase() === "website") {
      setWebsite(e.target.value);
    } else if (e.target.name.toLowerCase() === "contact number") {
      setContact(e.target.value);
    } else if (e.target.name.toLowerCase() === "email") {
      setEmail(e.target.value);
    }
    // else if (e.target.name.toLowerCase() === "gstin") {
    //   setGSTIN(e.target.value);
    // }
  }
  async function handelSubmit() {
    setLoading(true);
    let data = {
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      website,
      contact,
      email,
      //   gstin,
    };
    let res = await axios.post(`/api/config/address`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res) {
      setLoading(false);
      console.log(res);
      swal("Success!", res.data.message, res.data.status);
    }
  }

  return (
    <div>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 col-lg-6 col-xl-6">
                        <h1 className="text-left head-small">Address</h1>

                        <form>
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group">
                                <>
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Address Line 1
                                  </label>
                                  <input
                                    value={addressLine1}
                                    type="text"
                                    name="address line 1"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />{" "}
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Address Line 2
                                  </label>
                                  <input
                                    value={addressLine2}
                                    type="text"
                                    name="address line 2"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    City
                                  </label>
                                  <input
                                    value={city}
                                    type="text"
                                    name="city"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    State
                                  </label>
                                  <input
                                    value={state}
                                    type="text"
                                    name="state"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Country
                                  </label>
                                  <input
                                    value={country}
                                    type="text"
                                    name="country"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Pin Code
                                  </label>
                                  <input
                                    value={pincode}
                                    type="text"
                                    name="pincode"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Website
                                  </label>
                                  <input
                                    value={website}
                                    type="text"
                                    name="website"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Contact Number
                                  </label>
                                  <input
                                    value={contact}
                                    type="text"
                                    name="contact number"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />{" "}
                                  <label
                                    htmlFor="basicpill-phoneno-input"
                                    className="label-100 mt-3"
                                  >
                                    Email
                                  </label>
                                  <input
                                    value={email}
                                    type="text"
                                    name="email"
                                    onChange={(e) => handelChange(e)}
                                    className="form-control input-field "
                                    id="basicpill-phoneno-input"
                                  />
                                </>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-lg-12">
                              <div className="form-group text-left">
                                <button
                                  type="button"
                                  onClick={handelSubmit}
                                  className="btn btn-success btn-login waves-effect waves-light mr-3 pt-2 pb-2 pr-4 pl-4"
                                >
                                  <ClipLoader loading={loading} size={18} />
                                  {!loading && "Save"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* <!-- end table-responsive --> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- container-fluid --> */}
        </div>
        {/* <!-- End Page-content --> */}
      </div>
    </div>
  );
}

export default Address;
