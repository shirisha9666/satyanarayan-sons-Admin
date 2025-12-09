import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'
import { isAutheticated } from '../../../auth'




const EditCity = () => {
    const id = useParams()?.id
    const token = isAutheticated();
    const navigate = useNavigate()
    const [statesData, setStatesData] = useState([])
    const [data, setData] = useState({
        city_name: '',
        state: '',

    })
    const [loading, setLoading] = useState(false)
    const [limiter, setLimiter] = useState({
        city_name: 30,
        city_nameHas: 30,
    })

    const getCategory = () => {
        axios
            .get(`$/api/city/${id}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setData((prev) => ({
                    ...prev,
                    ...res.data?.data,
                }))
                setLimiter((prev) => ({
                    ...prev,
                    city_nameHas: prev.city_name - res.data?.data?.city_name.length,
                }))
            })
            .catch((err) => { })
        axios
            .get(`/api/state`, {
                headers: { 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setStatesData(res.data.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getCategory()
    }, [])

    const handleChange = (e) => {
        if (e.target.type === 'text') {
            if (e.target.value.length === limiter[e.target.id] + 1) return
            setLimiter((prev) => ({
                ...prev,
                [e.target.id + 'Has']: prev[e.target.id] - e.target.value.length,
            }))
        }
        setData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }

    const handleSubmit = () => {
        if (data.city_name.trim() === '' || data.state.trim() === '') {
            swal({
                title: 'Warning',
                text: 'Fill all mandatory fields',
                icon: 'error',
                button: 'Close',
                dangerMode: true,
            })
            return
        }
        setLoading(true)
        axios
            .patch(`/api/city/${id}`, data, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                swal({
                    title: 'Updated',
                    text: 'City updated successfully!',
                    icon: 'success',
                    button: 'Close',
                })
                setLoading(false)
                navigate('/cities', { replace: true })
            })
            .catch((err) => {
                setLoading(false)
                swal({
                    title: 'Warning',
                    text: 'Something went wrong!',
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
                            Edit City
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
                                {loading ? 'Loading' : 'Update'}
                            </Button>
                            <Link to="/cities">
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
                <div className="col-8 mx-auto">
                    <div className="card h-100">
                        <div className="card-body px-5">
                            <div className="mb-3">
                                <label htmlFor="city_name" className="form-label">
                                    City Name*
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="city_name"
                                    value={data.city_name}
                                    maxLength={limiter.city_name}
                                    onChange={(e) => handleChange(e)}
                                />
                                <p className="pt-1 pl-2 text-secondary">
                                    Remaining characters : {limiter.city_nameHas}
                                </p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="city_name" className="form-label">
                                    State Name*
                                </label>
                                <select
                                    onChange={(e) => handleChange(e)}
                                    value={data.state}
                                    className="form-control"
                                    id="state"
                                >
                                    <option value="">---select---</option>
                                    {statesData[0] ? (
                                        statesData.map((c, i) => (
                                            <option key={i} value={c._id}>
                                                {c.state_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            Please add a City
                                        </option>
                                    )}
                                </select>
                            </div>
                            {/* <div className="mb-3">
                                <label>Unique ID</label>
                                <input type="text" value={data._id} className="form-control" disabled />
                            </div>
                            <div className="mb-3">
                                <label>TimeStamp</label>
                                <input
                                    type="text"
                                    value={new Date(data.createdAt)}
                                    className="form-control"
                                    disabled
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCity
