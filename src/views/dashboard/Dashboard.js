import React, { lazy } from 'react'
import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { isAutheticated } from "../../auth.js";

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))


const Dashboard = () => {
  //1 st 
  const [users, setUsers] = useState([])
  const token = isAutheticated();

  const getAllUsers = async () => {
    let res = await axios.get(
      `/api/v1/admin/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(res.data)
    setUsers(res.data.users)


  }
  // //2nd 
  // const [category, setCategory] = useState([])
  // const getAllCategory = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/category/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   // console.log(res.data.category[0].image.url)
  //   setCategory(res.data.category)
  // }, [token]);

  // //3 requiment
  // const [requirement, setRequirement] = useState([])
  // // console.log(token)
  // const getRequirement = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/requirement/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   setRequirement(res.data.Requirement)

  // }, [token]);
  // //4 news
  // const [news, setNews] = useState([])

  // const getNews = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/news/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   setNews(res.data.news)


  // }, [token]);
  // //5 offers
  // const [offer, setOffer] = useState([])

  // const getOffer = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/offer/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   // console.log(res.data)
  //   setOffer(res.data.offer)


  // }, [token]);
  // //6 event
  // const [event, setEvent] = useState([])
  // const getEvent = useCallback(async () => {
  //   let res = await axios.get(
  //     `/api/event/getAll`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   // console.log(res.data)
  //   setEvent(res.data.Event)


  // }, [token]);
  useEffect(() => {
    getAllUsers();

  }, [token]);
  return (
    <>
      <WidgetsDropdown users={users} />

    </>
  )
}

export default Dashboard
