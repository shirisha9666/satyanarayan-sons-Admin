import React from "react";

import EditProfile from "./views/Profile/EditProfile.js";
//Cities
import Cities from "./views/configuration/cities/Cities.js";
import AddCity from "./views/configuration/cities/AddCity.js";
import EditCity from "./views/configuration/cities/EditCity.js";
//states
import EditState from "./views/configuration/states/EditStates.js";
import AddState from "./views/configuration/states/AddState.js";
import States from "./views/configuration/states/States.js";
//social media,address,logo
import Socialmedia from "./views/configuration/Socialmedia.js";
import Address from "./views/configuration/Address.js";
import Logo from "./views/configuration/Logo.js";
import Login from "./views/pages/login/Login";
//Franchisees
import Franchisees from "./views/Temples/Franchisees";
import AddFranchisee from "./views/Temples/AddFranchisee";
import EditFranchisee from "./views/Temples/EditFranchisee";
//products
import Products from "./views/Products/Products";
import AddProduct from "./views/Products/AddProduct";
import EditProduct from "./views/Products/EditProduct";
import ViewProduct from "./views/Products/ViewProduct";

//Order Management
import NewOrders from "./views/orders/NewOrders.js";
import ProcessingOrders from "./views/orders/ProcessingOrders.js";
import DispatchedOrders from "./views/orders/DispatchedOrders.js";
import DeliveredOrders from "./views/orders/DeliveredOrders.js";
import CancelledOrders from "./views/orders/CancelledOrders.js";
import ReturnedOrders from "./views/orders/ReturnedOrders.js";
import ViewOrder from "./views/orders/ViewOrder";
import AddOrder from "./views/orders/AddOrder";
//Taxes
import Tax from "./views/configuration/tax/Tax";
import Addtax from "./views/configuration/tax/Addtax";
import Edittax from "./views/configuration/tax/Edittax";
import EditOrder from "./views/orders/EditOrder";
import ViewOrders from "./views/orders/ViewOrders";
import Departures from "./views/Departures/Departures";
import AddDeparture from "./views/Departures/AddDeparture";
import Informations from "./views/Informations/Informations";
import AddInformations from "./views/Informations/AddInformations";

import ApplicationName from "./views/configuration/ApplicationName";
import CopyrightMessage from "./views/configuration/CopyrightMessage";
import ContactRequests from "./views/ContactRequests/ContactRequests";
import AddContactRequest from "./views/ContactRequests/AddContactRequest";
//Testimonials
import Testimonials from "./views/Testimonials/Testimonials";
import AddTestimonial from "./views/Testimonials/AddTestimonial";
import ViewTestimonial from "./views/Testimonials/ViewTestimonial";

//Faq
import Faqs from "./views/FAQs/FAQ";
import AddFaq from "./views/FAQs/AddFaq";
import EditFaq from "./views/FAQs/EditFaq";

import Policies from "./views/configuration/Policies/Policies";
//Appointments
import AddAppointment from "./views/Appointments/AddAppointment";
import EditAppointment from "./views/Appointments/EditAppointment";
import ViewAppointment from "./views/Appointments/ViewAppointment";
import Appointments from "./views/Appointments/Appointments";
//Leads
import Leads from "./views/Leads/Leads";
// Celebrities
import Celebrities from "./views/Celebrities/Celebrities";
import AddCelebrity from "./views/Celebrities/AddCelebrity";
import EditCelebrity from "./views/Celebrities/EditCelebrity";
import ViewCelebrity from "./views/Celebrities/ViewCelebrity";
//HomeBanners
import HomeBanners from "./views/HomePageBanners/HomeBanner";
import AddHomeBanner from "./views/HomePageBanners/AddHomeBanner";
//CampaignBanners
import CampaignBanners from "./views/CampaignBanners/CampaignBanners";
import AddCampaignBanner from "./views/CampaignBanners/AddCampaignBanners";
//ourCollections
import OurCollections from "./views/OurCollections/OurCollections";
import AddOurCollection from "./views/OurCollections/AddOurCollection";
// product categories
// import productCategories from "./views/ProductCategories/ProductCategories";
// import AddProductCategory from "./views/ProductCategories/AddProductCategory";
// import EditProductCategory from "./views/ProductCategories/EditProductCategory";
// import ViewProductCategory from "./views/ProductCategories/ViewProductCategory";
// product collections
import ProductCollections from "./views/ProductCollections/ProductCollections";
import AddProductCollection from "./views/ProductCollections/AddProductCollection";
import EditProductCollection from "./views/ProductCollections/EditProductCollection";
import ViewProductCollection from "./views/ProductCollections/ViewProductCollection";
import VideoCallRequests from "./views/VideoCallRequests/VideoCallRequests";
//  DashBoard
const Change_Password = React.lazy(() =>
  import("./views/pages/register/Change_password")
);



const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
///


const routes = [
  { path: "/", exact: true, name: "Home" },
  {
    path: "/change_password",
    name: "Change Password",
    element: Change_Password,
  },
  { path: "/profile/edit", name: "Edit Profile", element: EditProfile },
  // { path: '/profile', name: 'Profile', element: Profile },

  //Product
  { path: "/products", name: "products", element: Products },
  { path: "/product/add", name: "Add products", element: AddProduct },
  { path: "/product/edit/:id", name: "Edit products", element: EditProduct },
  { path: "/product/view/:id", name: "view products", element: ViewProduct },

  //Celebrities
  { path: "/celebrities", name: "celebrities", element: Celebrities },
  { path: "/celebrity/add", name: "Add celebrity", element: AddCelebrity },
  {
    path: "/celebrity/edit/:id",
    name: "Edit celebrity",
    element: EditCelebrity,
  },
  {
    path: "/celebrity/view/:id",
    name: "view celebrity",
    element: ViewCelebrity,
  },

  //HomeBanners
  { path: "/home-banners", name: "Home Banners", element: HomeBanners },
  { path: "/home-banner/add", name: "Add Home Banner", element: AddHomeBanner },

  //campaignBanners
  { path: "/campaign-banners", name: "Home Banners", element: CampaignBanners },
  {
    path: "/campaign-banner/add",
    name: "Add Home Banner",
    element: AddCampaignBanner,
  },

  //ourCollections
  {
    path: "/our-collections",
    name: "Our Collections",
    element: OurCollections,
  },
  {
    path: "/our-collection/add",
    name: "Add Our Collection",
    element: AddOurCollection,
  },

  //product Categories
  // {
  //   path: "/product-categories",
  //   name: "Product Categories",
  //   element: productCategories,
  // },
  // {
  //   path: "/product-category/add",
  //   name: "Add Product Categories",
  //   element: AddProductCategory,
  // },
  // {
  //   path: "/product-category/view/:id",
  //   name: "View Product Categories",
  //   element: ViewProductCategory,
  // },
  // {
  //   path: "/product-category/edit/:id",
  //   name: "Edit Product Categories",
  //   element: EditProductCategory,
  // },

  //product Collections
  {
    path: "/product-collections",
    name: "Product Collections",
    element: ProductCollections,
  },
  {
    path: "/product-collection/add",
    name: "Add Product Collections",
    element: AddProductCollection,
  },
  {
    path: "/product-collection/view/:id",
    name: "View Product Collections",
    element: ViewProductCollection,
  },
  {
    path: "/product-collection/edit/:id",
    name: "Edit Product Collections",
    element: EditProductCollection,
  },

  //Departure
  { path: "/departures", name: "Departures", element: Departures },
  { path: "/departure/add", name: "Add Departure", element: AddDeparture },
  { path: "/product/edit/:id", name: "Edit products", element: EditProduct },
  { path: "/product/view/:id", name: "view products", element: ViewProduct },
  //Appointment
  { path: "/appointments", name: "appointments", element: Appointments },
  {
    path: "/appointment/new/",
    name: "Add appointment",
    element: AddAppointment,
  },
  {
    path: "/appointment/edit/:id",
    name: "Edit appointment",
    element: EditAppointment,
  },
  {
    path: "/appointment/view/:id",
    name: "view appointment",
    element: ViewAppointment,
  },
  //Leads
  { path: "/leads", name: "Leads", element: Leads },
  //Contact Requests
  {
    path: "/contact/request",
    name: "Contact Requests",
    element: ContactRequests,
  },
  {
    path: "/contact/request/new",
    name: "AddContact Request",
    element: AddContactRequest,
  },

  //video call request
  {
    path: "/video-call/request",
    name: "Video Call Requests",
    element: VideoCallRequests,
  },

  // { path: '/complaint/view/:id', name: 'view Complain', element: ViewComplaint },
  //Complaints
  { path: "/testimonials", name: "Testimonials", element: Testimonials },
  { path: "/testimonial/new", name: "AddTestimonial", element: AddTestimonial },
  {
    path: "/testimonial/view/:id",
    name: "ViewTestimonial",
    element: ViewTestimonial,
  },

  // Faq
  { path: "/faqs", name: "Faqs", element: Faqs },
  { path: "/faq/new", name: "Add Faq", element: AddFaq },
  { path: "/faq/edit/:id", name: "Edit Faq", element: EditFaq },

  //informations
  { path: "/informations", name: "Informations", element: Informations },
  {
    path: "/information/new",
    name: "Add Informations",
    element: AddInformations,
  },

  //Order Management

  { path: "/orders/new", name: "New Orders", element: NewOrders },
  { path: "/order/add", name: "add Order", element: AddOrder },
  { path: "/orders/edit/:id", name: "Edit Order", element: EditOrder },
  { path: "/orders/view/:id", name: "View Order", element: ViewOrders },

  // { path: '/orders/processing', name: 'Processing Orders', element: ProcessingOrders },
  // { path: '/orders/dispatched', name: 'Dispatched Orders', element: DispatchedOrders },
  // { path: '/orders/delivered', name: 'Delivered Orders', element: DeliveredOrders },
  // { path: '/orders/cancelled', name: 'Cancelled Orders', element: CancelledOrders },
  // { path: '/orders/returned', name: 'Returned Orders', element: ReturnedOrders },
  { path: "/order/:status/:id", name: "View Order", element: ViewOrder },

  //dashboard

  { path: "/dashboard", name: "Dashboard", element: Dashboard },

  //------------settings------------------------//

  { path: "/policies", name: "Policies", element: Policies },

  { path: "/socialmedia", name: "Social Media", element: Socialmedia },
  {
    path: "/application/name",
    name: "ApplicationName",
    element: ApplicationName,
  },
  {
    path: "/copyright/message",
    name: "Copyright Message",
    element: CopyrightMessage,
  },

  { path: "/address", name: "Address", element: Address },
  { path: "/logo", name: "Logo", element: Logo },

  //Taxes
  { path: "/tax", name: "Tax Rates", element: Tax },
  { path: "/tax/add", name: "Add Tax", element: Addtax },
  { path: "/tax/edit/:id", name: "Edit Tax", element: Edittax },
  // -------------------------------------------//

  //
];

export default routes;
