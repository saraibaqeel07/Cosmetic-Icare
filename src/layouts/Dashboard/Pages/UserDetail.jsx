import { useParams } from "react-router-dom"
import ApiServices from "../../../services/Apis";
import { useEffect, useState } from "react";
import { Avatar, Box, Button, Card, CardContent, Chip, Grid, IconButton, Typography } from "@mui/material";
import moment from "moment";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import DataTable from "../../../components/DataTable";


const UserDetail = () => {
    const [data, setData] = useState(null)
    const [appointments, setAppointments] = useState([])
    const { id } = useParams()
    const [showTable, setShowTable] = useState(false)
    console.log(id);

    const getData = async () => {
        try {
            let params = {
                user_id: id,

            };

            const data = await ApiServices.getUserDetail(params);


            setData(data?.data?.userDetails)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    const columns = [
        {
            header: "Appointment Date",
            accessorKey: "firstName",
            cell: ({ row }) => (
                <Box>
                    {moment(row?.original?.date).format('MM-DD-YYYY')}
                </Box>
            ),
        },
        {
            header: "Time",
            accessorKey: "timeslot",
        },
        {
            header: "Client Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <Box>
                    {row?.original?.first_name + " " + row?.original?.last_name}
                </Box>
            ),
        },
        {
            header: "Mobile No.",
            accessorKey: "mobile",
        },
        {
            header: "PIN",
            accessorKey: "pin",
        },
       
    {
        header: "Actions",
        cell: ({ row }) => (
  
          <Box component={'div'} variant="contained" color="primary" sx={{ cursor: 'pointer' }} >
            <IconButton onClick={() => {      navigate(`/appointment-detail/${row?.original?._id}`, { state: row?.original }) }}>
              <NorthEastIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Box>
        ),
      },

    ]
    const getAppointments = async () => {
        try {
            let params = {
                user_id: id
            }

            const data = await ApiServices.getAppointmentsByUser(params);
            console.log(data?.data?.bookings);
            setShowTable(true)
            setAppointments(data?.data?.bookings)


        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
     
        getData()

    }, [])


    return (
        <div>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                User Detail
            </Typography>

            <Grid container xs={12} justifyContent={'center'} spacing={3} sx={{ border: "1px solid #ddd", borderRadius: 2, margin: '0 auto', p: 2 }}>

                <Grid item xs={12} sx={{ display: 'flex' }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <strong>Profile Pic:</strong> <Avatar
                            src={data?.picture}
                            alt={data?.first_name}
                            sx={{
                                position: "relative",
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                fontSize: 24,

                                color: "white",
                                cursor: "pointer",
                                objectFit: "cover",
                                textTransform: "capitalize",
                            }}

                        />
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">
                        <strong>First Name:</strong> {data?.first_name}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">
                        <strong>Last Name:</strong> {data?.last_name}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="body1">
                        <strong>Email:</strong> {data?.email}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="body1">
                        <strong>Phone:</strong> {data?.phone}
                    </Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="body1">
                        <strong>Address:</strong> 123 Maple Street, Apartment 45, Downtown, Los Angeles, CA 90001
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="body1">
                        <strong>DOB:</strong> {moment(data?.dob).format('MM-DD-YYYY')}
                    </Typography>
                </Grid>
                <Grid item xs={6}>

                    <strong>Status:</strong>

                    <Chip
                        label={data?.status === "active" ? "Active" : "Inactive"}
                        color={data?.status === "active" ? "success" : "error"}
                        sx={{ ml: 1, fontWeight: 600 }}
                    />
                </Grid>

                <Grid item xs={6} display="flex" justifyContent="flex-end">
                    <Button variant="contained" sx={{ textTransform: 'capitalize' }} onClick={()=> {getAppointments()}} color="primary">
                        Appointments
                    </Button>
                </Grid>
            </Grid>
            <Box mt={5}>
           {showTable  && <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
               Appointments
            </Typography>}
            {showTable  && <DataTable data={appointments} columns={columns} />}
            </Box>
            
        </div>
    )
}

export default UserDetail
