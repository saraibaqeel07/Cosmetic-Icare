import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Box, Paper } from "@mui/material";
import { useState } from "react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Manage sidebar state

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: sidebarOpen ? "calc(100% - 210px)" : "calc(100% - 50px)", // Dynamic width
          transition: "width 0.3s ease, margin-left 0.3s ease", // Added transition for margin-left
          overflowX: "hidden",
          ml: sidebarOpen ? "252px" : "82px", // Ensure proper alignment
        }}
        
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            width: "100%",
          }}
        >
          <Header />
        </Box>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: "24px",backgroundColor:"#eff6ff" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
