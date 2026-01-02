import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css";
import "react-app-polyfill/stable";
import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import axios from "axios";
import { store } from "./redux/store";
import { cibGmail } from "@coreui/icons";
import { createRoot } from "react-dom/client";
import { SeriesProvider } from "./views/series/SeriesContext";
import { Toaster } from "react-hot-toast";
import { AdminProvider } from "./views/series/AdminContext";
import { GenreProvider } from "./views/Genres/genreContext";
import { TrendingPrivoder } from "./views/Trending/TreadingContext";
import { CustomerProvider } from "./views/CustomerSupport/CustomerContext";
import { PlanProvider } from "./views/plans/PlanContext";
import { AdsProvider } from "./views/Advertisement/AdContext";
import { BillingProvider } from "./views/billing/billingContext";
import { BannerProvider } from "./views/Banners/bannerContext";
import { CategoryProvider } from "./views/category/CategoryContext";
import { SubCategoryProvider } from "./views/subcategory/subCategoryContext";
import { ProductProvider } from "./views/Product/ProductContenxt";
import { GoldSchemaProvider } from "./views/Gold-Schema/GoldSchemaContext";
import { GoldRateProvider } from "./views/Gold-Rate/GoldRateContext";
import { HomeCollectionProvider } from "./views/HomeCollection/HomeCollectionContext";
import { VideoProvider } from "./views/Video/VideoContext";
import { AboutProvider } from "./views/AboutSection/AboutContext";
import { BranchePrivoder } from "./views/Branches/BranchesContext";

// import { StyledEngineProvider } from '@mui/material/styles';
// import '@fontsource/roboto';

const setupAxios = () => {
  // axios.defaults.baseURL = "http://localhost:5000";
  // latest App deploy
  axios.defaults.baseURL = "https://satyanaran-sons-api.onrender.com";

  // axios.defaults.baseURL = "https://frameji-api.onrender.com";

  axios.defaults.headers = {
    "Cache-Control": "no-cache,no-store",
    Pragma: "no-cache",
    Expires: "0",
  };
};

setupAxios();
const domNode = document.getElementById("root");
const root = createRoot(domNode);
// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById("root")
// );
root.render(
  <Provider store={store}>
    <BranchePrivoder>
      <AboutProvider>
        <VideoProvider>
          <HomeCollectionProvider>
            <GoldRateProvider>
              <GoldSchemaProvider>
                <ProductProvider>
                  <SubCategoryProvider>
                    <CategoryProvider>
                      <BannerProvider>
                        <BillingProvider>
                          <PlanProvider>
                            <AdsProvider>
                              <CustomerProvider>
                                <TrendingPrivoder>
                                  <AdminProvider>
                                    <SeriesProvider>
                                      {/* <StyledEngineProvider injectFirst>   <App /></StyledEngineProvider> */}
                                      <App />
                                      <Toaster />
                                    </SeriesProvider>
                                  </AdminProvider>
                                </TrendingPrivoder>
                              </CustomerProvider>
                            </AdsProvider>
                          </PlanProvider>
                        </BillingProvider>
                      </BannerProvider>
                    </CategoryProvider>
                  </SubCategoryProvider>
                </ProductProvider>
              </GoldSchemaProvider>
            </GoldRateProvider>
          </HomeCollectionProvider>
        </VideoProvider>
      </AboutProvider>
    </BranchePrivoder>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
