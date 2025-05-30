import { Box, Button, Collapse, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from "@mui/icons-material/Logout";
import Navigation from "./navigation";
import ConfirmationDialog from "../../../components/confirmDialog";
import { AuthContext } from "../../../Context/AuthContext";
import { Images } from "../../../assets/images";
import { PrimaryButton } from "../../../components/buttons";
import ApiServices from "../../../services/Apis";
import moment from "moment";
import { CSVLink } from "react-csv";
import { showErrorToast } from "../../../components/Toaster";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const csvLink = useRef();
  const { user, setUser } = useContext(AuthContext);
  const [openMenus, setOpenMenus] = useState({});
  const [confirmationDialog, setConfirmationDialog] = useState(false)
  const [data, setData] = useState([])
  const [items, setItems] = useState([])
  const [csvData, setCsvData] = useState([]);

  const handleToggle = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  // Filter navigation based on user role
  const filteredNavigation = Navigation.filter(
    (item) => !(user?.role === "staff" && item.name.toLowerCase() === "staff")
  );
  useEffect(() => {
    if (user?.role == 'staff') {
      console.log(Navigation);

    }
  }, [])
  
     const getData = async () => {
          try {
              let params = {
                  page: 1,
                  limit: 999
              };
  
              const data = await ApiServices.getPatients(params);
  
              setItems(data?.data?.patients)
              setData(data?.data?.patients)
             
  
  
          } catch (error) {
              console.error("Error fetching location:", error);
          }
       
      };

      // *For Download CSV File
      const downloadCsv = () => {
        try {
          const title = ['sep=,'];
          const head = ['Sr', 'Title', 'Name', 'Email', 'Phone', 'Address', 'Status'];
          const data2 = [];
          
          data2.push(title);
          data2.push(head);
      
          for (let index = 0; index < items?.length; index++) {
            const user = items[index];
      
            let newRow = [
              index + 1,
              user?.title || '',
              user?.first_name + user?.last_name || '',
              user?.email || '',
              user?.phone || '',
              user?.address || '',
              user?.in_active ? 'Inactive' : 'Active' 
            ];
            
            data2.push(newRow);
          }
      
          console.log(data2);
          setCsvData(data2);
        } catch (error) {
          showErrorToast(error);
        }
      };
      

	useEffect(() => {
		if (csvData.length > 0) {
			csvLink?.current.link.click();
		}

	}, [csvData]);
  useEffect(() => {
    getData()
  }, [])
  
  return (
    <Box
      sx={{
        width: open ? '220px' : '50px',
        transition: 'width 0.3s ease',
        height: "100vh",
        bgcolor: "#46aef5",
        color: "white",
        padding: 2,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        overflowX: 'hidden'
      }}
    >
      {data?.length > 0  && (
					<CSVLink
						ref={csvLink}
						data={csvData}
						filename={`patients-data ${moment().format('DD-MMM-YYYY h:mm A')}.csv`}
						target="_blank"
					/>
				)}
      <ConfirmationDialog
        open={confirmationDialog}
        onClose={() => setConfirmationDialog(false)}
        message={"Are you sure you want to logout?"}
        action={async () => {
          setConfirmationDialog(false);
          await new Promise((resolve) => {
            localStorage.clear();
            setUser('')
            resolve();
          });
          navigate('/');
        }}
      />

      <Box
        sx={{
          height: 'calc(100vh - 60px)',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#3498db', borderRadius: '4px' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
        }}
      >
        {/* Sidebar Toggle Button */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "flex-end" : "center" }}>
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        {open && <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box component={'img'} src={Images.sidebarLogo} width={'150px'}>

          </Box>
        </Box>}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
          <PrimaryButton  onClick={() => downloadCsv()}   title={"Export Patient Data"} />
        </Box>
        <List>
          {filteredNavigation.map((item) => {
            // Check if the parent is active (either its own path or any child's path)
            const isActive =
              location.pathname === item.path ||
              (item.child && item.child.some((child) => location.pathname === child.path));

            return (
              <div key={item.name}>
                <ListItemButton
                  sx={{
                    gap: open ? 1 : 0,
                    display: "flex",
                    alignItems: "center",
                    width: !open ? '40px' : '100%',
                    height: !open ? '40px' : '100%',
                    justifyContent: open ? "flex-start" : "center",
                    paddingX: open ? 2 : 0,
                    paddingY: !open ? 3 : 1,
                    backgroundColor: isActive ? (open ? "#0b0962" : "transparent") : "transparent",
                    borderRadius: open ? "4px" : "50%",
                    transition: "all 0.3s ease-in-out",
                    '&:hover': {
                      ...(!open && {
                        borderRadius: '50%',
                        width: !open ? '40px' : '100%',
                        height: !open ? '40px' : '100%',
                        backgroundColor: '#0b0962',
                      })
                    },
                    mt: !open ? 3.5 : 2

                  }}
                  onClick={() => {
                    if (item.child) {
                      handleToggle(item.name);
                    }
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "unset",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: isActive && !open ? "#0b0962" : "transparent",
                      borderRadius: "50%",
                      width: !open ? "36px" : "auto",
                      height: !open ? "36px" : "auto",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.name}
                      sx={{
                        ".MuiTypography-root": {
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "white",
                          transition: "color 0.3s ease-in-out",
                        },
                      }}
                    />
                  )}

                  {open && item.child && (
                    <Box sx={{ transition: "transform 0.3s ease-in-out" }}>
                      {openMenus[item.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Box>
                  )}
                </ListItemButton>

                {open && item.child && (
                  <Collapse in={openMenus[item.name]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.child.map((childItem) => (
                        <ListItemButton
                          key={childItem.name}
                          sx={{ pl: 4 }}
                          onClick={() => navigate(childItem.path)}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: "30px",
                              color: location.pathname === childItem.path ? "#0076bf" : "white",
                            }}
                          >
                            {childItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={childItem.name}
                            sx={{
                              ".MuiTypography-root": {
                                fontSize: "14px",
                                fontWeight: 500,
                                color: location.pathname === childItem.path ? "#0076bf" : "white",
                              },
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            );
          })}

        </List>

      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          ":hover": { color: 'white' },
          position: "absolute",
          bottom: "50px",
          left: !open ? "7px" : '50px',
        }}
      >
        <Button
          className="logout_Box"
          variant="contained"
          onClick={() => setConfirmationDialog(true)}
          sx={{
            color: 'white',
            textTransform: "none",
            borderRadius: "12px",
            p: "9px 17px 7px 17px",
            ":hover": { color: 'white' },
            backgroundColor: "transparent",
            boxShadow: "none",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <LogoutIcon
              className="logout_Icon"
              sx={{ color: 'white', fontSize: "23px" }}
            />
            {open ? "Logout" : ''}
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
