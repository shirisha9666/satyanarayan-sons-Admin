import React from "react";
import CIcon from "@coreui/icons-react";
import { TbDeviceIpadMinus } from "react-icons/tb";
import { cilCreditCard, cilReceipt } from "@coreui/icons";
import { cilBullhorn } from "@coreui/icons";
import { cilBasket } from "@coreui/icons";
import { cilStar } from "@coreui/icons";
import { cilHome } from '@coreui/icons'
import { cilVideo } from '@coreui/icons'
import { cilInfo } from '@coreui/icons'
import { cilBuilding } from "@coreui/icons";



import {
  cibMaterialDesign,
  cilAddressBook,
  cilAppsSettings,
  cilBrush,
  cilCart,
  cilHeadphones,
  cilCat,
  cilClipboard,
  cilCommand,
  cilCompress,
  cilContact,
  cilImage,
  cilLanguage,
  cilLoopCircular,
  cilMedicalCross,
  cilNotes,
  cilSpeedometer,
  cilTv,
  cilTablet,
  cilText,
  cilUser,
  cilAlarm,
  cilFeaturedPlaylist,
  cilLocationPin,
  cilSettings,
  cilMoney,
  cilColorBorder,
  cilColorPalette,
  cilGroup,
  cilUserPlus,
  cilPaperclip,
  cilCommentBubble,
  cilImagePlus,
  cilBadge,
  cibCplusplus,
  cibAboutMe,
  cibAddthis,
  cibAdguard,
  cibAlgolia,
  cibExpertsExchange,
  cibProtonmail,
  cibProtoIo,
  cilPlaylistAdd,
  cilChatBubble,
  cilPeople,
  cibCodeship,
  cibC,
  cibCoffeescript,
  cilCopy,
  cilCircle,
  cil3d,
  cilApps,
  cilGraph,
  cilActionUndo,
  cilObjectUngroup,
  cibLibreoffice,
} from "@coreui/icons";
import {
  CListGroup,
  // cisMicSettings,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CTabContent,
} from "@coreui/react";

import { cilList } from "@coreui/icons";
import { cilLayers } from "@coreui/icons";
const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    group: "",
  },

  {
    component: CNavItem,
    name: "Banners",
    icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
    to: "/banner",
    group: "Settings",
  },

  {
    component: CNavItem,
    name: "Categories",
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    to: "/category",
    group: "Settings",
  },

  {
    component: CNavItem,
    name: "SubCategories",
    icon: <CIcon icon={cilLayers} customClassName="nav-icon" />,
    to: "/subcategory",
    group: "Settings",
  },

  // Products

  {
    component: CNavItem,
    name: "Products",
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    to: "/products",
    group: "Settings",
  },
// Home Collections
 {
    component: CNavItem,
    name: "Home Collection",
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    to: "/home-collections",
    group: "Settings",
  },
   {
    component: CNavItem,
    name: "Video",
    icon: <CIcon icon={cilVideo} customClassName="nav-icon" />,
    to: "/video-section",
    group: "Settings",
  },
     {
    component: CNavItem,
    name: "About",
    icon: <CIcon icon={cilInfo} customClassName="nav-icon" />,
    to: "/about-section",
    group: "Settings",
  },
  {
    component: CNavItem,
    name: "Gold Schemes",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/gold-schemes",
    group: "Settings",
  },
  {
    component: CNavItem,
    name: "Gold Rates",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    to: "/gold-rates",
    group: "Settings",
  },
   {
    component: CNavItem,
    name: "Branches",
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    to: "/Branches",
    group: "Settings",
  },
    {
    component: CNavItem,
    name: "Employees & Access",
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
    to: "/employee",
    group: "Employees & Access",
  },

  {
    component: CNavItem,
    name: "Customers",
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    to: "/customers-details",
    group: "Customers",
  },

  {
    component: CNavItem,
    name: "Customer Support",
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
    to: "/support/request",
    group: "Customer Service",
  },
  // //Blog start
  // {
  //   component: CNavItem,
  //   name: "Blog",
  //   icon: <CIcon icon={cilImagePlus} customClassName="nav-icon" />,
  //   to: "/blogs",
  //   group: "Blog",
  // },
  // Employee

 
  {
    component: CNavGroup,
    name: "Settings",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    group: "",

    items: [
      {
        component: CNavItem,
        name: "Advertisement",
        icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
        to: "/Advertisement",
        group: "Settings",
      },
      {
        component: CNavItem,
        name: "Content ",
        icon: <CIcon icon={cilText} customClassName="nav-icon" />,
        to: "/content",
        group: "Settings",
      },
      {
        component: CNavItem,
        name: "GST",
        icon: <CIcon icon={cilTablet} customClassName="nav-icon" />,
        to: "/gst",
        group: "Product Management",
      },
      {
        component: CNavItem,
        name: "Social Media",
        icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
        to: "/socialmedia",
        group: "Settings",
      },
      // {
      //   component: CNavItem,
      //   name: "Currency",
      //   icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
      //   to: "/currency",
      //   group: "Settings",
      // },
      {
        component: CNavItem,
        name: "Application Name",
        icon: <CIcon icon={cilText} customClassName="nav-icon" />,
        to: "/application/name",
        group: "Settings",
      },

      {
        component: CNavItem,
        name: "Address",
        icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
        to: "/address",
        group: "Settings",
      },
      {
        component: CNavItem,
        name: "Logos",
        icon: <CIcon icon={cilCommand} customClassName="nav-icon" />,
        to: "/logo",
        group: "Settings",
      },
      {
        component: CNavItem,
        name: "Copyright Message",
        icon: <CIcon icon={cilLanguage} customClassName="nav-icon" />,
        to: "/copyright/message",
        group: "Settings",
      },
     
    ],
  },
];

export default _nav;
