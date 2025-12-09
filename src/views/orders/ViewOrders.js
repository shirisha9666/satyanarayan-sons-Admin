



import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { Link, useNavigate, useParams } from 'react-router-dom'


import { useDispatch, useSelector } from 'react-redux'

import toast from 'react-hot-toast'

import Button from '@mui/material/Button'
import { isAutheticated } from '../../auth'

function ViewOrders() {
    const { status, id } = useParams()

    const { cartItems, subTotal, shippingCharge, tax, shipingInfo, total } = useSelector(
        (state) => state.cart
    );


    const AllStates = useSelector(
        (state) => state
    );
    const getValue = useRef()
    const getFranchiseeID = useRef()
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const printOrderRef = useRef()
    const token = isAutheticated()
    const [productData, setProductData] = useState([])
    const [allFranchisee, setAllFranchisee] = useState([])
    const [allTax, setAllTax] = useState([])
    const [orderDetails, setOrderDetails] = useState()



    const [productDetails, setProductDetails] = useState()
    const [loading, setLoading] = useState(true)
    const [orderId, setOrderId] = useState(null)
    const [orderStatus, setOrderStatus] = useState('')
    const [data, setData] = useState({
        product_Name: '',
        address: '',
        quantity: '',
        contact_Number: '',
        total_Price: '',
    })
    useEffect(() => {
        const getSingleOrder = async () => {
            setLoading(true)
            const res = await axios.get(`/api/order/getOne/${id}`, {
                headers: { 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${token}` },
            })
            if (res.data) {
                setLoading(false)
                setOrderId(res.data?.order?.order_id)
                setOrderDetails(res.data?.order)
                console.log(res.data?.order.shippingInfo?.city)
                // let options = {
                //     Franchisee: res.data?.order?.shippingInfo?.Franchisee?._id,
                //     name: res.data?.order?.shippingInfo?.name,


                //     contact_Number: res.data?.order?.shippingInfo?.contact_Number,
                //     contact_Person_Name: res.data?.order?.shippingInfo?.contact_Person_Name,
                //     address: res.data?.order?.shippingInfo?.address,
                //     city: res.data?.order?.shippingInfo?.city,
                //     price_Lable: res.data?.order?.shippingInfo?.Franchisee?.price_Lable,
                //     state: res.data?.order?.shippingInfo?.state,
                //     banner: res.data?.order?.shippingInfo?.Franchisee?.banner?.url,
                //     // Franchisee_Url: res?.data?.data?.url
                // }
                // dispatch({ type: "addShippingInfo", payload: options });
                // if (res.data?.order?.orderItems) {
                //     res.data?.order?.orderItems.map((i, ind) => {
                //         dispatch({ type: "addToCart", payload: i });
                //         dispatch({ type: "calculatePrice" });

                //     })
                // }

            }
        }
        getSingleOrder()

    }, [token])



    const handleChange = (e) => {
        if (e.target.type === 'text') {
            setData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
        } else {
            setOrderStatus(e.target.value)
        }
    }
    const handleQuantityChange = (e) => {

        setData((prev) => ({
            ...prev,
            quantity: e.target.value,
            total_Price: (productDetails?.base_Price * e.target.value)
        }))

    }





    function getBack() {
        navigate(`/orders/${status}`, { replace: true })
    }

    return (
        <>
            {' '}
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

                                    <div style={{ fontSize: '22px' }} className="fw-bold">
                                        <p> View Order</p>
                                        {orderId && <span><small>Order ID :  {orderId}</small> </span>}

                                    </div>
                                    <div className="page-title-right">
                                        {/* <Button
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
                                            {loading ? 'Loading' : 'Edit Now'}
                                        </Button> */}
                                        <Link to="/orders/new">
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
                        {loading ? (
                            <div class="d-flex justify-content-center">
                                <div class="spinner-border  text-info" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (

                            <div className="row">
                                <div className="col-lg-6 mt-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="mt-1">
                                                <h5 className='text-success'>Order Status: {orderDetails?.orderStatus}</h5>
                                                <label className="fw-bold">Franchisee :</label>
                                                {/* <div className="d-flex">
                                                <select
                                                    className="form-control me-2"
                                                    onChange={handleChange}
                                                    value={orderStatus}
                                                    ref={getFranchiseeID}
                                                    disabled={shipingInfo !== null}
                                                >
                                                    <option value="" disabled></option>
                                                    {allFranchisee && allFranchisee.map((item, index) =>
                                                        <option key={index} value={item?._id}>{item?.name}</option>
                                                    )}
                                                </select>
                                                <button className='btn-sm btn-primary' onClick={(e) => handleGetSingleFrenchisee(e)} >Add</button>
                                            </div> */}


                                            </div>


                                            {
                                                orderDetails?.shipingInfo !== null &&
                                                <div className="my-2">
                                                    <div className="row" style={{ fontSize: '14px' }}>
                                                        <div className="col-sm-4">
                                                            <img
                                                                src={orderDetails?.shippingInfo?.Franchisee?.banner?.url}
                                                                alt={orderDetails?.shippingInfo?.name}
                                                                // width='100%'
                                                                style={{
                                                                    width: '100%',
                                                                    objectFit: 'contain',
                                                                    maxHeight: '100px',
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="col-sm-8">
                                                            <h6 className="m-0 ms-2">{orderDetails?.shippingInfo?.name}</h6>
                                                            <parent className="m-0 ms-2 mt-3">
                                                                Address. : {orderDetails?.shippingInfo?.address}
                                                            </parent>
                                                            <p className="m-0 ms-2 mt-1">
                                                                Contact No. : {orderDetails?.shippingInfo?.contact_Number}
                                                            </p>
                                                            <p className="m-0 ms-2 mt-1">
                                                                Contact Person Name : {orderDetails?.shippingInfo?.contact_Person_Name}
                                                            </p>
                                                            <p className="m-0 ms-2 mt-1">
                                                                Price Lable : {orderDetails?.shippingInfo?.Franchisee?.price_Lable}
                                                            </p>

                                                            <p className="m-0 ms-2 mt-1">
                                                                City : {orderDetails?.shippingInfo?.city}
                                                            </p>
                                                            <p className="m-0 ms-2 mt-1">
                                                                State : {orderDetails?.shippingInfo?.state}
                                                            </p>







                                                        </div>
                                                    </div>
                                                    <hr />

                                                </div>
                                            }
                                            <div className="mt-3">
                                                <label>
                                                    <span className="fw-bold">Payment Status : </span>
                                                    {orderDetails?.isPaid === false ? 'Not Paid' : 'Paid'}
                                                </label>
                                            </div>
                                            <div className="mt-1">
                                                <label>
                                                    <span className="fw-bold"> Order Created By: </span>
                                                    {orderDetails?.user?.name}
                                                </label>
                                            </div>
                                            <div className="mt-1">
                                                <label>
                                                    <span className="fw-bold">Razorpay Order ID : </span>
                                                    {productData?.razorpay_order_id}
                                                </label>
                                            </div>

                                            <div className="mt-1">
                                                <label>
                                                    <span className="fw-bold">Razorpay Payment ID : </span>
                                                    {productData?.razorpay_payment_id}
                                                </label>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-lg-6 mt-3">

                                    {orderDetails?.shipingInfo !== null && <div className="card">
                                        <div className="card-body">
                                            {/* <div className="mt-1">
                                            <label className="fw-bold">Select Product:</label>
                                            <div className="d-flex">
                                                <select
                                                    className="form-control me-2"
                                                    // onChange={handleGetSingleProduct}
                                                    // value={productData?._id}
                                                    ref={getValue}

                                                >
                                                    <option value="" >-----</option>
                                                    {productData && productData.map((item, index) =>
                                                        <option key={index} value={item?._id}>{item?.name}</option>
                                                    )}

                                                </select>
                                                <button className='btn-sm btn-primary' onClick={(e) => handleGetSingleProduct(e)}>Add</button>

                                            </div>

                                        </div> */}

                                            <div className="mt-2">
                                                <h6 className="fw-bold">Products : {orderDetails?.orderItems?.length}</h6>

                                                {
                                                    orderDetails?.orderItems && orderDetails?.orderItems.map((productDetails, i) =>
                                                        <div className="my-2">
                                                            <div className="row" style={{ fontSize: '14px' }}>
                                                                <div className="col-sm-4">
                                                                    <img
                                                                        src={productDetails?.image}
                                                                        alt={productDetails?.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            objectFit: 'contain',
                                                                            maxHeight: '150px',
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-sm-8">
                                                                    <h6 className="m-0 ms-2">{productDetails?.name}</h6>
                                                                    <div className="row">
                                                                        <div className="col-sm-6">


                                                                            <div
                                                                                className='d-flex justify-content-center mt-3 me-3 '
                                                                                style={{

                                                                                    width: "6rem",


                                                                                }}>
                                                                                <span className='px-2 mt-1' style={{}}> Quantity: {productDetails?.quantity}</span>

                                                                            </div>

                                                                            <p className="m-0 mt-3 ms-3">
                                                                                <stong>Price With Tax:</stong> ₹{productDetails?.price_With_Tax}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-sm-6">
                                                                            <p className="m-0 mt-3">
                                                                                <stong> Price:</stong> ₹{productDetails?.price}
                                                                            </p>




                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <hr />

                                                        </div>
                                                    )
                                                }
                                                <h5 className="m-0 contents-center mt-3">

                                                    <small className='mb-2'>Shipping Charge: </small> ₹{orderDetails?.shipping_charge}

                                                    <br />
                                                    <span className='mt-2'> Total Order Value: </span> ₹{orderDetails?.total_amount}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>

                                    }







                                    <div className="card my-1">
                                        <div className="card-body">
                                            <label className="fw-bold">Status Timeline :</label>
                                            <table
                                                className="table table-info table-sm m-0"
                                                style={{
                                                    borderRadius: '8px',
                                                    borderCollapse: 'collapse',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <tbody>
                                                    <tr className="text-center">
                                                        <th scope="row">Order Placed On</th>
                                                        <td> : </td>
                                                        <td>
                                                            {orderDetails?.createdAt
                                                                ? new Date(orderDetails?.createdAt).toLocaleString('en-IN', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: 'numeric',
                                                                    hour12: true,
                                                                })
                                                                : new Date(productData?.placed_on).toLocaleString('en-IN', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: 'numeric',
                                                                    hour12: true,
                                                                })}
                                                        </td>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th scope="row">Processing Started</th>
                                                        <td> : </td>
                                                        <td>
                                                            {productData?.status_timeline?.processing
                                                                ? new Date(productData?.status_timeline?.processing).toLocaleString(
                                                                    'en-IN',
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: 'numeric',
                                                                        hour12: true,
                                                                    },
                                                                )
                                                                : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th scope="row">Dispatched On</th>
                                                        <td> : </td>
                                                        <td>
                                                            {productData?.status_timeline?.dispatched
                                                                ? new Date(productData?.status_timeline?.dispatched).toLocaleString(
                                                                    'en-IN',
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: 'numeric',
                                                                        hour12: true,
                                                                    },
                                                                )
                                                                : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th scope="row">Delivered On</th>
                                                        <td> : </td>
                                                        <td>
                                                            {productData?.status_timeline?.delivered
                                                                ? new Date(productData?.status_timeline?.delivered).toLocaleString(
                                                                    'en-IN',
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: 'numeric',
                                                                        hour12: true,
                                                                    },
                                                                )
                                                                : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th scope="row">Cancelled On</th>
                                                        <td> : </td>
                                                        <td>
                                                            {productData?.status_timeline?.cancelled
                                                                ? new Date(productData?.status_timeline?.cancelled).toLocaleString(
                                                                    'en-IN',
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: 'numeric',
                                                                        hour12: true,
                                                                    },
                                                                )
                                                                : '-'}
                                                        </td>
                                                    </tr>
                                                    <tr className="text-center">
                                                        <th scope="row">Returned On</th>
                                                        <td> : </td>
                                                        <td>
                                                            {productData?.status_timeline?.returned
                                                                ? new Date(productData?.status_timeline?.returned).toLocaleString(
                                                                    'en-IN',
                                                                    {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: 'numeric',
                                                                        hour12: true,
                                                                    },
                                                                )
                                                                : '-'}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>






                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
            <div style={{ display: 'none' }}>
                {/* <PrintOrderDetails productData={productData} ref={printOrderRef} /> */}
            </div>
        </>
    )
}

export default ViewOrders
