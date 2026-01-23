import axios from "axios";
import toast from "react-hot-toast";
import { isAutheticated } from "src/auth";

const { createContext, useContext, useState, useEffect } = require("react");

const SubCategoryContext = createContext();

export const SubCategoryProvider = ({ children }) => {
  const token = isAutheticated();
  const [categoryError, setCategoryError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [banner, setBanner] = useState([]);
  const [bannertype, setBannerType] = useState("Home Banner");
  const [bannerId, setBannerId] = useState(null);
  const [subcategoryViweId, setSubCategoryViewId] = useState(null);
  const [subCategoryViewDetais, setSubCategoryViewDetails] = useState([]);
  const [categoryBtn, setCategoryBtn] = useState("");
  const [seachSubCategory, setSearchSubCategory] = useState("");

  (categoryBtn, setCategoryBtn, seachSubCategory, setSearchSubCategory);
  const handlegetAllSubcategorys = async (
    page = 1,
    itemPerPage,
    categoryBtn,
    seachSubCategory,
  ) => {
    try {
      setLoading(true);
        setCategoryError("");
    setBanner([]);
      const response = await axios.get(
        "/api/product/category/get/subcategory",
        {
          params: {
            page,
            limit: itemPerPage,
            categoryname: categoryBtn,
            subcategoryname: seachSubCategory,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("response?.data", response?.data?.message);
      setBanner(response?.data);
      setCategoryError(response?.data?.message);
    } catch (error) {
      const errormssage = error.response && error.response.data.message;
      console.log("errormssage", errormssage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setBannerId(id);
      let resp = await axios.delete(
        `/api/product/category/delete/subcategory/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      let message = resp?.data?.message;
      console.log("message", resp?.data);

      await handlegetAllSubcategorys(
        page,
        itemPerPage,
        categoryBtn,
        seachSubCategory,
      );
      toast.success(message);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setBannerId(null);
    }
  };

  const handleSubcategoryDetailsById = async (id) => {
    try {
      setSubCategoryViewId(id);
      let resp = await axios.get(
        `/api/product/category/subcategory/getById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSubCategoryViewDetails(resp?.data);
    } catch (error) {
      const errormessage = error.response && error.response.data.error;
      console.log("errormessage", errormessage);
    } finally {
      setSubCategoryViewId(null);
    }
  };
  useEffect(() => {
    handlegetAllSubcategorys(page, itemPerPage, categoryBtn, seachSubCategory);
  }, []);

  return (
    <SubCategoryContext.Provider
      value={{
        banner,
        handlegetAllSubcategorys,
        setPage,
        setItemPerPage,
        setBannerType,
        bannertype,
        itemPerPage,
        loading,
        page,
        handleDelete,
        bannerId,
        handleSubcategoryDetailsById,
        subcategoryViweId,
        subCategoryViewDetais,
        categoryBtn,
        setCategoryBtn,
        seachSubCategory,
        setSearchSubCategory,
        categoryError,
      }}
    >
      {children}
    </SubCategoryContext.Provider>
  );
};

export const useSubCategory = () => useContext(SubCategoryContext);
