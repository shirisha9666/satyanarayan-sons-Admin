import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button'
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

import { CFormSelect, CFormSwitch } from "@coreui/react";
import { isAutheticated } from "../../auth";
// import { WebsiteURL } from '../WebsiteURL'

const EditProduct = () => {
  const id = useParams()?.id;

  const token = isAutheticated();
  const navigate = useNavigate();
  const [data, setData] = useState({
    image: [],
    imageURL: [],
    name: "",
    description: "",
    productCode: "",
    purity: "",
    color: "",
    grossWeight: "",
    netWeight: "",
    carats: "",
    clarity: "",
    NoOfDiamonds: "",
    price: "",
    stock: "",
    settingType: "",
    otherInfo: "",
    productCollection: "",
    category: "",
    setAsFeatured: false,

    // price: '',
  });
  console.log(data);

  const colorOptions = [
    { value: "", label: "Select Color" },
    { value: "White", label: "White" },
    { value: "Yellow", label: "Yellow" },
    { value: "Rose", label: "Rose" },
    { value: "Yellow Gold", label: "Yellow Gold" },
    { value: "White Gold", label: "White Gold" },
    { value: "Gold", label: "Gold" },
    { value: "Rose Gold", label: "Rose Gold" },
    { value: "Silver", label: "Silver" },
    { value: "Platinum", label: "Platinum" },
  ];

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [productCategoriesData, setProductCategoriesData] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [productCollectionsData, setProductCollectionsData] = useState([]);

  const getProductCategoriesData = async () => {
    axios
      .get(`api/productCategory/getAll`)
      .then((res) => {
        setLoadingCategories(true);
        setProductCategoriesData(res.data.productCategory);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingCategories(false);
      });
  };

  const getProductCollectionsData = async () => {
    axios
      .get(`api/productCollection/getAll`)
      .then((res) => {
        setLoadingCollections(true);
        setProductCollectionsData(res.data.productCollection);
        setLoadingCollections(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingCollections(false);
      });
  };

  useEffect(() => {
    getProductCategoriesData();
    getProductCollectionsData();
  }, []);

  // set category options for select
  const categoryOptions = [
    { value: "", label: "Select Category" },
    ...productCategoriesData.map((item) => ({
      value: item.name,
      label: item.name,
    })),

    // { value: 'Diamond', label: 'Diamond' },
  ];

  // set collection options for select
  const productCollectionOptions = [
    { value: "", label: "Select Collection" },
    ...productCollectionsData.map((item) => ({
      value: item.name,
      label: item.name,
    })),
  ];

  const [loading, setLoading] = useState(false);
  // const [allTax, setAllTax] = useState([])

  const [imagesPreview, setImagesPreview] = useState([]);
  //get Productdata
  const getProduct = async () => {
    axios
      .get(`/api/product/getOne/${id}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data?.product?.image)
        // if (res.data?.product?.image) {
        //     res.data?.product?.image.map(item => {
        //     })

        // }

        // setImagesPreview(res.data?.product?.image);
        // setImage preview for each image in product
        // res.data?.product?.image?.map((item) => {
        //   setImagesPreview((old) => [...old, item.url]);
        // });
        // set data for each field but clear the image field
        setData((prev) => ({
          ...prev,
          ...res.data?.product,
          image: [],
          imageURL: res.data?.product?.image?.url,
        }));
      })
      .catch((err) => {});
  };
  // console.log(imagesPreview)
  useEffect(() => {
    getProduct();
  }, []);

  // useEffect(() => {
  //     const getAllTax = async () => {
  //         const res = await axios.get(`/api/tax/view_tax`, {
  //             headers: { 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${token}` },
  //         })
  //         if (res.data) {
  //             setAllTax(res.data)
  //         }
  //     }
  //     getAllTax()

  // }, [token])

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
        if (imagesPreview.length > 6) {
          swal({
            title: "Warning",
            text: "maximum  image Upload ",
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

  // const TaxRatechange = async (e) => {
  //     let taxDetails = {
  //         name: e.target.value.slice(12, 16),
  //         rate: Number(e.target.value.slice(4, 6)),

  //         taxId: e.target.value.slice(24)

  //     }

  //     let trRate = taxDetails.rate / 100
  //     let PriceWithT = Number(data.price);
  //     PriceWithT += +((PriceWithT * trRate).toFixed());

  //     //price_Level_2_With_Tax
  //     let price_Level_2_With_Tax = Number(data.price_Level_2);
  //     price_Level_2_With_Tax += +((price_Level_2_With_Tax * trRate).toFixed());
  //     //
  //     //price_Level_3_With_Tax
  //     let price_Level_3_With_Tax = Number(data.price_Level_3);
  //     price_Level_3_With_Tax += +((price_Level_3_With_Tax * trRate).toFixed());
  //     setData((prev) => ({
  //         ...prev,
  //         price_With_Tax: PriceWithT,

  //         price_Level_2_With_Tax: price_Level_2_With_Tax,

  //         price_Level_3_With_Tax: price_Level_3_With_Tax,
  //         taxId: taxDetails.taxId

  //     }))
  // }\

  console.log(imagesPreview, "imagesPreview");

  // console.log(data.image.length)
  const handleSubmit = () => {
    if (
      data.name.trim() === "" ||
      data.description.trim() === "" ||
      data.image === ""
      // data.price_With_Tax === '' ||
      // data.price_Level_2 === '' ||
      // data.price_Level_2_With_Tax === '' ||
      // data.price_Level_3 === '' ||
      // data.price_Level_3_With_Tax === '' ||
      // data.imageURL.trim() === ''
    ) {
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

    formData.append("description", data.description);
    //formData.append('price', data.price)
    formData.append("productCode", data.productCode);
    formData.append("purity", data.purity);
    formData.append("color", data.color);
    formData.append("grossWeight", data.grossWeight);
    formData.append("netWeight", data.netWeight);
    formData.append("carats", data.carats);
    formData.append("clarity", data.clarity);
    formData.append("NoOfDiamonds", data.NoOfDiamonds);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("settingType", data.settingType);
    formData.append("otherInfo", data.otherInfo);
    formData.append("productCollection", data.productCollection);
    formData.append("category", data.category);
    formData.append("setAsFeatured", data.setAsFeatured);

    data.image.forEach((Singleimage) => {
      formData.append("image", Singleimage);
    });

    axios
      .put(`/api/product/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/formdata",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        swal({
          title: "Updated",
          text: "Product Updated successfully!",
          icon: "success",
          button: "ok",
        });
        setLoading(false);
        navigate("/products", { replace: true });
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
              Edit Product
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
              <Link to="/products">
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
                  Product Name*
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={data.name}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Description*
                </label>

                <textarea
                  cols="20"
                  rows="2"
                  type="text"
                  className="form-control"
                  id="description"
                  value={data.description}
                  onChange={(e) => handleChange(e)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Product Image*
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
                <strong className="fs-6 fst-italic">
                  *Please Upload maximum four images
                </strong>
              </div>

              {imagesPreview.length > 0 && (
                <div id="createProductFormImage" className="w-25 d-flex">
                  {imagesPreview.map((image, index) => (
                    <img
                      className=" w-50 p-1 "
                      key={index}
                      src={image}
                      alt="Product Preview"
                    />
                  ))}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="productCode" className="form-label">
                  Product Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productCode"
                  value={data.productCode}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="purity" className="form-label">
                  Purity
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="purity"
                  value={data.purity}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Color
                </label>
                <CFormSelect
                  id="color"
                  value={data.color}
                  onChange={(e) => handleChange(e)}
                  options={colorOptions}
                ></CFormSelect>
              </div>

              <div className="mb-3">
                <label htmlFor="grossWeight" className="form-label">
                  Gross Weight
                  <span className="text-secondary fst-italic">
                    {" "}
                    (enter units also)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="grossWeight"
                  value={data.grossWeight}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="netWeight" className="form-label">
                  Net Weight
                  <span className="text-secondary fst-italic">
                    {" "}
                    (enter units also)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="netWeight"
                  value={data.netWeight}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="carats" className="form-label">
                  Carats
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="carats"
                  value={data.carats}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="clarity" className="form-label">
                  Clarity
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="clarity"
                  value={data.clarity}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="NoOfDiamonds" className="form-label">
                  No Of Diamonds
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="NoOfDiamonds"
                  value={data.NoOfDiamonds}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  value={data.price}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="stock" className="form-label">
                  Stock
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="stock"
                  value={data.stock}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="settingType" className="form-label">
                  Setting Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="settingType"
                  value={data.settingType}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="otherInfo" className="form-label">
                  Other Info
                </label>
                <textarea
                  cols="20"
                  rows="2"
                  type="text"
                  className="form-control"
                  id="otherInfo"
                  value={data.otherInfo}
                  maxLength="100"
                  onChange={(e) => handleChange(e)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="productCollection" className="form-label">
                  productCollection
                </label>
                <CFormSelect
                  id="productCollection"
                  value={data.productCollection}
                  onChange={(e) => handleChange(e)}
                  options={productCollectionOptions}
                ></CFormSelect>
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <CFormSelect
                  id="category"
                  value={data.category}
                  onChange={(e) => handleChange(e)}
                  options={categoryOptions}
                ></CFormSelect>
              </div>

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
        {/* <div className="col-lg-6 col-md-6  col-sm-12 my-1">
                    <div className="card h-100">
                        <div className="card-body px-5">


                            <div className="mb-3 me-3">
                                <label htmlFor="title" className="form-label">
                                    Price (optional)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    value={Math.abs(data.price)}
                                    onChange={(e) => handleChange(e)}

                                />
                            </div>








                            {allTax.length > 0 && <div className=" mb-3">
                                <label htmlFor="title" className="form-label">
                                    Tax*
                                </label>  <select className="   form-control" name="" id=""
                                    onChange={(e) => TaxRatechange(e)}
                                >
                                    <option value="" disabled>-----</option>

                                    {allTax.map((t, i) =>
                                        <option key={i} value={`tax:${t.tax},name:${t.name}  ,taxId:${t._id}`}>{t.tax}% {t.name}</option>
                                    )}
                                </select>
                            </div>
                            }
                        </div>
                    </div>
                </div> */}
      </div>
    </div>
  );
};

export default EditProduct;
