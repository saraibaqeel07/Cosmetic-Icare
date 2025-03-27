import { Box, Chip, IconButton, Paper, Typography } from "@mui/material"
import DataTable from "../../../components/DataTable"
import { useEffect, useState } from "react"
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { PrimaryButton } from "../../../components/buttons";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../../services/Apis";
import moment from "moment";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ConfirmationDialog from "../../../components/confirmDialog";
import { showPromiseToast } from "../../../components/Toaster";


const Events = () => {
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)


    const getData = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getEvents(params);


            setData(data?.data?.events)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const columns = [
      
        {
            header: "Event Name",
            accessorKey: "name",
        },
        {
            header: "Address",
            accessorKey: "address",
            cell: ({ getValue }) => {
                const Address = getValue();
                return (
                    <Box>
                        {Address}
                    </Box>
                );
            },
        },
        {
            header: "Start Time",
            accessorKey: "start_time",
            
        },
        {
            header: "End Time",
            accessorKey: "end_time",
            
        },

        {
            header: "Description",
            accessorKey: "description",
            
        },

        {
            header: "Actions",
            cell: ({ row }) => (

                <Box variant="contained" color="primary" sx={{ cursor: 'pointer', display: 'flex', gap: 2 }} >

                    <IconButton onClick={() => navigate("/update-event", { state: row?.original })}>
                        <DriveFileRenameOutlineIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                    <IconButton onClick={() => {
                        const url = `https://www.google.com/maps?q=${row?.original?.latitude},${row?.original?.longitude}`;
                        window.open(url, "_blank");
                    }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: '16px' }} />

                    </IconButton>
                    <IconButton onClick={() => { setSelectedRow(row?.original); setConfirmationDialog(true) }}>
                        <DeleteOutlineIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                </Box>
            ),
        },

    ]

    const HandleDelete = async () => {

        try {
            let obj = {
                id: selectedRow?._id
            };

            const promise = ApiServices.DeleteEvent(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);

            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );



        } catch (error) {
            console.log(error);
        }
        finally {
            getData()
        }

    };
    useEffect(() => {
        getData()

    }, [])

    return (
        <div>
            <ConfirmationDialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                message={"Are you sure you want to delete?"}
                action={async () => {
                    setConfirmationDialog(false);
                    HandleDelete()

                }}
            />
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                        Events
                    </Typography>
                    <PrimaryButton onClick={() => navigate('/create-event')} title={"Create"} />
                </Box>
                {data?.length > 0 && <DataTable data={data} columns={columns} />}

            </Paper>
        </div>
    )
}

export default Events
