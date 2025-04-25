import { Box, Card, CardContent, Grid, IconButton, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import ApiServices from "../../../services/Apis";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import DescriptionIcon from "@mui/icons-material/Description"
import SendIcon from "@mui/icons-material/Send"
import TaskAltIcon from "@mui/icons-material/TaskAlt"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Images } from "../../../assets/images";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"


const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  const getData = async () => {
    try {
      let params = {
        page: 1,
        limit: 999
      };

      const data = await ApiServices.getStats(params);

      console.log(data?.data);

      setStats(data?.data)


    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  const statsData = [
    {
      title: "Total Patients",
      value: "248",
      icon: <PeopleAltIcon />,
      color: "#00c2a8",
      bgColor: "#00c2a8",
    },
    {
      title: "Consent Forms",
      value: "436",
      icon: <DescriptionIcon />,
      color: "#0066ff",
      bgColor: "#0066ff",
    },
    {
      title: "Sent Forms",
      value: "123",
      icon: <SendIcon />,
      color: "#8c54ff",
      bgColor: "#8c54ff",
    },
    {
      title: "Completed Forms",
      value: "$1,264",
      icon: <TaskAltIcon />,
      color: "#ff7a45",
      bgColor: "#ff7a45",
    },
  ]

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
    
      <Grid container xs={12} spacing={2}>
        <Grid item lg={7}>
        <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8fbff",
          height:'120px',
          mb: 3,
          mt: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#1976d2" }}>
            Welcome <span style={{ color: "#1976d2", fontWeight: 700 }}>{name}</span>! <span className="waving-hand">&#x1F44B;</span>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            You have <strong>{2} patients</strong> remaining today. Remember to check documentation before
            call.
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <img src={Images?.stethoscope} alt="Stethoscope" style={{ height: 150, width: "auto" }} />
        </Box>
      </Paper>
        </Grid>
        <Grid item lg={5}>
        <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '12px',
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "black",
          height:'120px',
          mb: 3,
          mt: 3,
        }}
      >
         <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            <FormatQuoteIcon sx={{ color: "#1976d2", fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" sx={{ fontStyle: "italic", color: "#e0e0e0",fontSize:'18px' }}>
              The good physician treats the disease; the great physician treats the patient who has the disease.
            </Typography>
            
          </Box>
      </Paper>
        </Grid>
      </Grid>
      <Grid container mt={1} spacing={2}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} >
            <Card
              sx={{
                borderRadius: "16px",
                backgroundColor: stat.bgColor,
                color: "white",
                height: "120px",
                position: "relative",
                overflow: "visible",
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: stat.color,
                        marginRight: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                  {/* <IconButton size="small" sx={{ color: "white" }}>
                  <MoreVertIcon />
                </IconButton> */}
                </Box>
              </CardContent>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  opacity: 0.8,
                  height: "60%",
                  width: "40%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ fontSize: 60, transform: "rotate(-15deg)" }}>{stat.icon}</Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

    </div>
  )
}

export default Dashboard
