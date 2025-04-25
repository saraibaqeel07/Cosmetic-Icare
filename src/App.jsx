import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/Dashboard";
import adminRoutes from "./layouts/Dashboard/routes/adminroutes";
import { ToasterComponent } from "./components/Toaster";
import Login from "./layouts/Dashboard/Pages/Login";
import { AuthContext } from "./Context/AuthContext";
import { Box, CircularProgress } from "@mui/material";
const UserDoc = lazy(() => import("../src/layouts/Dashboard/Pages/UserDoc"))
const UserForm = lazy(() => import("../src/layouts/Dashboard/Pages/UserForm"))

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after checking localStorage
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return <Box sx={{display:'flex',justifyContent:'center'}}><CircularProgress sx={{color:'#0052a8'}} size={80} /></Box>; // Prevents redirects until state is initialized
  }

  return (
    <Router>
      <AuthContext.Provider value={{ user, setUser, login, logout }}>
        <ToasterComponent />
        <Routes>
          
          {/* Prevents unwanted redirect before user state is restored */}
          <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path='/patient/form/:id' element={<UserForm/>}/>
          <Route path='/patient/doc/:id' element={<UserDoc/>}/>
          {/* DashboardLayout should wrap all child routes */}
          {user && (
            <Route path="/" element={<DashboardLayout />}>
              {adminRoutes.map((route) => {
                const PageComponent = route.component;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Suspense   fallback={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh", // Adjust as needed
                          }}
                        >
                          <CircularProgress sx={{color:'#0052a8'}} size={80} />
                        </Box>
                      }>
                        <PageComponent />
                      </Suspense>
                    }
                  />
                );
              })}
            </Route>
          )}

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
