import React, { useEffect } from "react";
import { usePlan } from "./PlanContext";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Container, Paper, Typography } from "@material-ui/core";

const ViewPlan = () => {
  const { setPlanId, getPlan ,handlegetByIdplan,planIdloading} = usePlan();
  const { id } = useParams();
  console.log("View Plan Id", id, getPlan);

  const dummyPlan = {
    Plan: "Standard - 3 Months",
    Gst: "gst12", // GST id
    Price: "5000",
    Total_Price: "5600",
    limit: "75",
    features: ["Feature A", "Feature B"],
  };
  useEffect(() => {
    if (id) {
      handlegetByIdplan(id);
    }
  }, [id]);
  const fontstyle={
    fontWeight:"600",color:"black"
  }

  return (
    <Container>
      <Typography style={{textAlign:"center",fontSize:"2rem",
        fontWeight:"600",paddingBottom:"1rem",}}>Plan Details</Typography>
        {planIdloading===id?<Box sx={{textAlign:"center",paddingTop:"3rem"}}><CircularProgress/></Box>:
          <Box sx={{display:"flex",flexDirection:"column",gap:"2rem"}}>
        <Box sx={{display:"flex",gap:"5rem",fontWeight:"600"}}>
          <Typography style={{...fontstyle,width:"10%"}}>Plan Name</Typography>
          <Typography  style={{...fontstyle}}>:</Typography>
          <Typography  style={{...fontstyle}}>{getPlan?.Plan}</Typography>
        </Box>
          <Box sx={{display:"flex",gap:"5rem",fontWeight:"600"}}>
          <Typography style={{...fontstyle,width:"10%"}}>Gst</Typography>
          <Typography style={{...fontstyle}}>:</Typography>
          <Typography style={{...fontstyle}}>{getPlan?.Gst?.Gst}%</Typography>
        </Box>
      
        <Box sx={{display:"flex",gap:"5rem",fontWeight:"600"}}>
          <Typography style={{...fontstyle,width:"10%"}}>Price</Typography>
          <Typography  style={{...fontstyle}}>:</Typography>
          <Typography style={{...fontstyle}}>₹{getPlan?.Price}</Typography>
        </Box>
      
        <Box sx={{display:"flex",gap:"5rem",fontWeight:"600"}}>
          <Typography style={{...fontstyle,width:"10%"}}> Total Price</Typography>
          <Typography style={{...fontstyle}}>:</Typography>
          <Typography style={{...fontstyle}}>₹{getPlan?.Total_Price}</Typography>
        </Box>
      
        <Box sx={{display:"flex",gap:"5rem",fontWeight:"600"}}>
          <Typography style={{...fontstyle,width:"10%"}}>Duration</Typography>
          <Typography style={{...fontstyle}}>:</Typography>
          <Typography style={{...fontstyle}}>{getPlan?.Duration}</Typography>
        </Box>
          <Box sx={{display:"flex",gap:"5rem",fontWeight:"600"}}>
          <Typography style={{...fontstyle,width:"10%"}}>Plan Features</Typography>
          <Typography style={{...fontstyle}}>:</Typography>
          {getPlan?.features?.map((item)=> <Typography style={{...fontstyle}}>
            {item}
          </Typography>)}
         
        </Box>
      
      
      </Box>}
    
    </Container>
  );
};

export default ViewPlan;
