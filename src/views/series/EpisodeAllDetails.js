// import { Box, Typography } from '@material-ui/core'
import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSeries } from "./SeriesContext";
import { useParams } from "react-router-dom";

const EpisodeAllDetails = () => {
  const { getsingleEpisode,episodeData } = useSeries();
  const {id}=useParams()

console.log("episodeData",episodeData)
console.log("id",id)
  useEffect(()=>{
    getsingleEpisode(id)
  },[id])

  return (
    <div>
      <Stack>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "600",
            paddingY: "1rem",
            borderBottom: "2px solid red",
            marginBottom: "10px",
          }}
        >
          Episode Details
        </Typography>

        <Stack sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Title
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.title}</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Episodenumber
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.episodenumber}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Duration
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.duration}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Thumbnail
            </Typography>
            <Typography>:</Typography>
            <img
              src={episodeData?.thumbnail?.fileUrl || ""}
              style={{ height: "2rem", width: "2rem" }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              audioUrl
            </Typography>
            <Typography>:</Typography>
            <Stack style={{ width: "50%" }}>
            <audio controls style={{ width: "50%",}}>
                          <source
                            type="audio/mpeg"
                            src={episodeData?.audioUrl?.fileUrl}
                          ></source>
                        </audio>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Description
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.description}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              About
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.about}</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Subjectname
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.subject}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Genrename
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.genre}</Typography>
          </Box>
            <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              Play Type
            </Typography>
            <Typography>:</Typography>
            <Typography>{episodeData?.pricingType}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "2rem" }}>
            <Typography
              sx={{ fontSize: "1rem", fontWeight: "600", width: "20%" }}
            >
              IsStandalone
            </Typography>
            <Typography>:</Typography>
            <Typography>{String(episodeData?.isStandalone)}</Typography>
          </Box>
        </Stack>
      </Stack>
    </div>
  );
};

export default EpisodeAllDetails;
