

import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'
import { isAutheticated } from '../../auth'

// import { WebsiteURL } from '../WebsiteURL'

const EditAppointment = () => {
    const token = isAutheticated()
    const navigate = useNavigate()
    const [data, setData] = useState({

        name: '',
        email: '',
        mobile: '',
        description: '',
        date: '',
        time: '',
        // Type: '',

    })
    const [validForm, setValidForm] = useState(false)
    const id = useParams()?.id

    const getAppointment = () => {
        axios
            .get(`/api/appointment/getOne/${id}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data?.appointment?.date)
                setData((prev) => ({
                    ...prev,
                    ...res.data?.appointment,
                    date: new Date(res.data?.appointment?.date)
                }))

            })
            .catch((err) => { })

    }

    useEffect(() => {
        getAppointment()
    }, [])

    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState({
        emailError: '',
        mobileError: ''

    })
    const validEmailRegex = RegExp(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    )
    const validMobileRegex = RegExp(
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    )
    const validateForm = () => {
        let valid = true
        Object.values(errors).forEach((val) => {
            if (val.length > 0) {
                valid = false
                return false
            }
        })
        Object.values(data).forEach((val) => {
            if (val.length <= 0) {
                valid = false
                return false
            }
        })
        return valid
    }

    //cheking email and password
    useEffect(() => {
        if (validateForm()) {
            setValidForm(true)
        } else {
            setValidForm(false)
        }
    }, [errors])



    const handleChange = (e) => {

        const { id, value } = e.target
        if (id === 'email') {

            setErrors({
                ...errors,
                emailError: validEmailRegex.test(value) ? '' : 'Email is not valid!',
            })


        }
        if (id === 'mobile') {
            setErrors({
                ...errors,
                mobileError: validMobileRegex.test(e.target.value) ? '' : 'Mobile Number is not valid!',
            })


        }


        setData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }



    const handleSubmit = () => {
        if (
            data.name.trim() === ''
            // data.email.trim() === '' ||
            // data.description === '' ||

            // data.mobile === ''

        ) {
            swal({
                title: 'Warning',
                text: 'Fill Name  field',
                icon: 'error',
                button: 'Close',
                dangerMode: true,
            })
            return
        }
        setLoading(true)
        const formData = new FormData()
        formData.set('name', data.name)
        formData.set('email', data.email)
        formData.set('description', data.description)

        formData.set('mobile', data.mobile)
        formData.set('date', data.date)
        formData.set('time', data.time)



        axios
            .put(`/api/appointment/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/formdata',
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((res) => {
                swal({
                    title: 'Added',
                    text: 'Appointment Updated successfully!',
                    icon: 'success',
                    button: 'ok',
                })
                setLoading(false)
                navigate('/appointments', { replace: true })
            })
            .catch((err) => {
                setLoading(false)
                const message = err.response?.data?.message || 'Something went wrong!'
                swal({
                    title: 'Warning',
                    text: message,
                    icon: 'error',
                    button: 'Retry',
                    dangerMode: true,
                })
            })
    }

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
                        <div style={{ fontSize: '22px' }} className="fw-bold">
                            Edit Appointment
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <h4 className="mb-0"></h4>
                        </div>

                        <div className="page-title-right">
                            <Button
                                variant="contained"
                                color="primary"
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: '1rem',
                                    textTransform: 'capitalize',
                                    marginRight: '5px',
                                }}
                                onClick={() => handleSubmit()}
                                disabled={loading}
                            >
                                {loading ? 'Loading' : 'Edit'}
                            </Button>
                            <Link to="/appointments">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: '1rem',
                                        textTransform: 'capitalize',
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
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={data.name}
                                    maxLength={35}
                                    onChange={(e) => handleChange(e)}
                                />
                                {data.name ? <><small className="charLeft mt-4 fst-italic">
                                    {35 - data.name.length} characters left
                                </small></> : <></>

                                }
                            </div>


                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Email (Optional)
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    value={data.email}

                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.emailError && (
                                    <p className="text-center py-2 text-danger">{errors.emailError}</p>
                                )}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Mobile (Optional)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="mobile"
                                    value={data.mobile}

                                    onChange={(e) => handleChange(e)}
                                />
                                {errors.mobileError && (
                                    <p className="text-center py-2 text-danger">{errors.mobileError}</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Appointment Date (Optional)
                                </label>
                                <input
                                    type="Date"
                                    className="form-control"
                                    id="date"
                                    value={data.date}

                                    onChange={(e) => handleChange(e)}
                                />

                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Appointment Time (Optional)
                                </label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="time"
                                    value={data.time}

                                    onChange={(e) => handleChange(e)}
                                />

                            </div>

                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Description (optional)
                                </label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    rows="6"
                                    cols="50"
                                    value={data.description}
                                    placeholder='your Description...'
                                    maxLength="500"
                                    onChange={(e) => handleChange(e)}
                                >
                                </textarea>

                                {data.testimonial ? <><small className="charLeft mt-4 fst-italic">
                                    {500 - data.testimonial.length} characters left
                                </small></> : <></>
                                }
                            </div>
                            {/* <div className="mb-3">
                                <label htmlFor="image" className="form-label">
                                    Photo (optional)*
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleChange(e)}
                                />
                                <p className="pt-1 pl-2 text-secondary">Upload jpg, jpeg and png only*</p>
                            </div>
                            <div className="mb-3" style={{ height: '200px', maxWdth: '100%' }}>
                                <img
                                    src={data.imageURL}
                                    alt="Uploaded Image will be shown here"
                                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                                />

                            </div> */}
                            {/* <div className="mb-3">
                                <label htmlFor="title" className="form-label">
                                    Description *
                                </label>
                                <br />
                                <textarea id="w3review" name="w3review" rows="10" cols="100">
                                    At w3schools.com you will learn how to make a website. They offer free tutorials in all web development technologies.
                                </textarea>
                            </div> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EditAppointment
