import React, { useEffect, useState } from "react";
import { CRow, CCol, CWidgetStatsA } from "@coreui/react";
import { isAutheticated } from "src/auth";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
import { useSeries } from "../series/SeriesContext";
import { useCategory } from "../category/CategoryContext";
import { useSubCategory } from "../subcategory/subCategoryContext";
import { useProduct } from "../Product/ProductContenxt";

const WidgetsDropdown = ({ genre = [] }) => {
  const { category } = useCategory();
  const { banner } = useSubCategory();
  const { products, loading, handlegetAllProductsCount, productCount } =
    useProduct();

  useEffect(() => {
    handlegetAllProductsCount();
  }, []);

    const colors = ["primary", "dark", "secondary", "info", "success"];

  console.log("products0000000000000000000000000000", productCount);

  return (

     <div className="px-3 py-2">
      {/* ===== OVERVIEW ===== */}
      <h4 className="mb-3 fw-semibold text-dark">Overview</h4>

      <CRow className="mb-4">
        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="info"
            value={loading ? <CircularProgress size={22} /> : category?.result?.length}
            title="Total Categories"
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="warning"
            value={loading ? <CircularProgress size={22} /> : banner?.category?.length}
            title="Total Subcategories"
          />
        </CCol>

        <CCol sm={6} lg={3}>
          <CWidgetStatsA
            className="shadow-sm h-100"
            color="success"
            value={loading ? <CircularProgress size={22} /> : products?.totalBanners}
            title="Total Products"
          />
        </CCol>
      </CRow>

      {/* ===== CATEGORY WISE ===== */}
      <h4 className="mb-3 fw-semibold text-dark">Category-wise Products</h4>

      <CRow>
        {productCount?.map((val, index) => (
          <CCol sm={6} lg={3} key={val.categoryName}>
            <CWidgetStatsA
              className="mb-4 shadow-sm h-100"
              color={colors[index % colors.length]}
              value={loading ? <CircularProgress size={22} /> : val.totalProducts}
              title={val.categoryName}
            />
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default WidgetsDropdown;
