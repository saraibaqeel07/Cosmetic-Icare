import { Avatar, IconButton, Menu, MenuItem, Typography } from "@mui/material";

import { Box } from "@mui/material";


import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationDialog from "../../../components/confirmDialog";
import { AuthContext } from "../../../Context/AuthContext";









const Header = () => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const location = useLocation();





    return (
        <>
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: '#FAFAFA',
                    px: 3,
                    py: 1,
                    boxShadow: "0px 4px 8px 0px #9B9B9B1A",
                }}
            >
             
                <Box display={'flex'} alignItems={'center'} gap={2} >
                    {location?.pathname != '/' ? <> <Typography variant="h6" sx={{ color: '#0052a8',fontWeight:'bold' }}>IClinic</Typography>
                        <Box sx={{ border: '0.5px solid #434343', height: "30px" }}></Box>
                        <Typography variant="h6" sx={{ color: 'black', fontSize: '22px', fontWeight: 700 }}>
                            {location?.pathname
                                ?.split("/")
                                .filter((segment, index, arr) => index !== arr.length - 1 || !/^[a-f0-9]{24}$/i.test(segment)) // Remove if last segment is a MongoDB-like ObjectId
                                .join(" ")
                                .replace(/-/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Typography>
                    </> : <Typography sx={{ color: 'black', fontSize: '22px', fontWeight: 700 }}>Dashboard</Typography>}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>

                    <IconButton onClick={handleClick} sx={{

                        background: "none", ":active": {
                            outline: 'none',
                            background: "none !important"
                        }
                        , ":hover": {
                            outline: 'none',
                            background: "none !important"
                        }
                        , ":focus": {
                            outline: 'none',
                            background: "none"
                        }
                    }}>
                        &nbsp;&nbsp;
                        <Avatar className="avatar-image" alt={user?.first_name} sx={{ width: 35, height: 35 }} src={'asdas'} />
                        &nbsp;&nbsp;<span style={{ fontSize: '15px', fontWeight: 'bold' }}>{user?.first_name}</span>
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        sx={{
                            '.MuiPaper-root': {
                                width: '150px'
                            }
                        }}
                    >
                        <MenuItem onClick={() => { setAnchorEl(false); navigate('/profile') }}> <SettingsIcon /> &nbsp; Profile</MenuItem>
                        <MenuItem onClick={() => setConfirmationDialog(true)}> <LogoutIcon /> &nbsp;   Logout</MenuItem>
                    </Menu>



                </Box>
            </Box>


        </>
    );
};

export default Header;
