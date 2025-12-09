import React from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { BeatLoader } from 'react-spinners'
{/* <BeatLoader color="#36d7b7" /> */ }

const WidgetsDropdown = ({ users }) => {
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>

              {users.length}
            </>
          }
          title="Total Users"

        />
      </CCol>
      {/* <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              {category.length}
            </>
          }
          title="Total Categories"

        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            <>
              {requirement.length}

            </>
          }
          title="Requirements"

        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={
            <>
              {news.length}

            </>
          }
          title="Total News"

        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="success"
          value={
            <>
              {offer.length}

            </>
          }
          title="Total Offers"

        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="dark"
          value={
            <>
              {event.length}

            </>
          }
          title="Total Events"

        /> */}
      {/* </CCol> */}
    </CRow>
  )
}

export default WidgetsDropdown
