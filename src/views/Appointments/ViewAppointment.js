
import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import swal from 'sweetalert';

import { Link, useParams } from "react-router-dom";
import { isAutheticated } from "../../auth";

function ViewAppointment() {
    const [appointment, setAppointment] = useState([])
    const { id } = useParams();
    const token = isAutheticated();

    const getAppointment = useCallback(async () => {
        let res = await axios.get(
            `/api/appointment/getOne/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setAppointment(res.data.appointment)


    }, [token]);

    useEffect(() => {
        getAppointment();
    }, [getAppointment]);





    //change time formate
    function formatAMPM(date) {
        var hours = new Date(date).getHours();
        var minutes = new Date(date).getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }


    return (
        <div className=" main-content">
            <div className="  my-3 page-content">
                <div className="container-fluid">
                    {/* <!-- start page title --> */}
                    <div className="row">
                        <div className="col-12">
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-3">Appointment</h4>
                                <Link to="/appointments"><button type="button" className="btn btn-info float-end mb-3 ml-4">Back</button></Link>

                            </div>
                        </div>
                    </div>
                    {/* <!-- end page title --> */}

                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row ml-0 mr-0  mb-10">

                                    </div>
                                    <div className="table-responsive table-shoot">
                                        <table className="table table-centered table-nowrap mb-0">
                                            <thead className="thead-light">

                                                <tr><th>Id</th> <td><h5>{appointment?._id}</h5></td></tr>
                                                <tr><th>Name</th>                                                        <td>{appointment?.name}</td></tr>


                                                {appointment?.email && <tr><th> Email</th><td>{appointment?.email}</td></tr>}
                                                {appointment?.mobile && <tr><th> Mobile</th><td>{appointment?.mobile}</td></tr>}
                                                {appointment?.description && <tr><th> Description</th><td>{appointment?.description}</td></tr>}
                                                {appointment?.date && <tr><th> Appointment Date</th><td>{new Date(`${appointment?.date}`).toDateString()}</td></tr>}

                                                {appointment?.time && <tr><th> Appointment Time</th><td>{appointment?.time}</td></tr>}





                                                {/* <tr><th>Appointment Time</th><td>{appointment?.time}</td></tr>
                                                <tr><th>Location</th><td>{appointment?.location}</td></tr> */}
                                                <tr><th> Appoinment Created</th><td>
                                                    {new Date(`${appointment?.createdAt}`).toDateString()}<span> , {`${formatAMPM(appointment?.createdAt)}`}</span>
                                                </td></tr>
                                                {/* <tr><th>Updated At</th>
                                                    <td>
                                                        {new Date(`${appointment?.updatedAt}`).toDateString()}<span> , {`${formatAMPM(appointment?.updatedAt)}`}</span>
                                                    </td>
                                                </tr> */}

                                            </thead>
                                            <tbody>

                                            </tbody>
                                        </table>
                                    </div>


                                    {/* <!-- end table-responsive --> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- container-fluid --> */}
            </div>
        </div>
    );

}


export default ViewAppointment
