
import {

    Paper,

    Typography,
    Button,
    Box,
    IconButton,
    CircularProgress, // Import TableSortLabel
} from "@mui/material"
import DataTable from "../../../components/DataTable"
import { Calendar } from 'rsuite';
import "rsuite/Calendar/styles/index.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import ApiServices from "../../../services/Apis";
import { useEffect, useState } from "react";
import moment from "moment";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { useNavigate } from "react-router-dom";



const Appointments = () => {
    const [selectedMonth, setSelectedMonth] = useState()
    const [selectedDate, setSelectedDate] = useState(null)
    const [excludedDays, setExcludedDays] = useState([])
    const [appointmentsDates, setAppointmentsDates] = useState([])
    const [loader, setLoader] = useState(false)
    const [data, setData] = useState([])
    const navigate = useNavigate()


    const renderCell = (date) => {
        // Convert the date to YYYY-MM-DD format in the local timezone
        const formattedDate = date.getFullYear() +
            "-" + String(date.getMonth() + 1).padStart(2, "0") +
            "-" + String(date.getDate()).padStart(2, "0");

        if (appointmentsDates.includes(formattedDate)) {
            return (
                <div style={{ position: "relative" }}>
                    <span
                        style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            position: "absolute",
                            top: "3px",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                    />
                </div>
            );
        }
        return null;
    };

    // // Dummy data
    // const data = [
    //     { id: 1, firstName: "John", lastName: "Doe", age: 30, city: "New York" },
    //     { id: 2, firstName: "Jane", lastName: "Smith", age: 25, city: "Los Angeles" },
    //     { id: 3, firstName: "Bob", lastName: "Johnson", age: 35, city: "Chicago" },
    //     { id: 4, firstName: "Alice", lastName: "Brown", age: 28, city: "Houston" },
    //     { id: 5, firstName: "Charlie", lastName: "Davis", age: 42, city: "Phoenix" },
    //     { id: 6, firstName: "Eva", lastName: "Wilson", age: 31, city: "Philadelphia" },
    //     { id: 7, firstName: "Frank", lastName: "Moore", age: 29, city: "San Antonio" },
    //     { id: 8, firstName: "Grace", lastName: "Taylor", age: 36, city: "San Diego" },
    //     { id: 9, firstName: "Henry", lastName: "Anderson", age: 41, city: "Dallas" },
    //     { id: 10, firstName: "Ivy", lastName: "Thomas", age: 27, city: "San Jose" },
    // ]

    // Column definitions with sorting
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
                    <IconButton onClick={() => { navigate(`/appointment-detail/${row?.original?._id}`, { state: row?.original }) }}>
                        <NorthEastIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                </Box>
            ),
        },

    ]
    const getCalendar = async () => {
        console.log(selectedDate)
        try {
            let params = {
                month: selectedDate ? moment(selectedDate).format('YYYY-MM') : moment().format('YYYY-MM')
            };

            const data = await ApiServices.getCalendar(params);

            console.log(data);
            setAppointmentsDates(data?.data?.activeDates)




        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    const handleMonthChange = (newDate) => {
        console.log("New month selected:", appointmentsDates.includes(moment(newDate).format('YYYY-MM-DD')));
        if (appointmentsDates.includes(moment(newDate).format('YYYY-MM-DD'))) {
            console.log('asdasd');
            setLoader(true)
            getAppointments(moment(newDate).format('YYYY-MM-DD'))

        }
        else {
            setData([])
        }

        setSelectedDate(newDate)
        if (selectedMonth != moment(newDate).format('MM')) {
            setSelectedMonth(moment(newDate).format('MM'))
        }


    };
    const getExcludeDays = async () => {
        try {


            const data = await ApiServices.getSettings();
            console.log(data?.data?.settings?.exclude_days);
            setExcludedDays(data?.data?.settings?.exclude_days)



        } catch (error) {
            console.error(error);
        }
    };

    const getAppointments = async date => {
        try {
            let params = {
                date: date
            }

            const data = await ApiServices.getAppointments(params);
            console.log(data?.data?.bookings);
            setData(data?.data?.bookings)



        } catch (error) {
            console.error(error);
        }
        finally {
            setLoader(false)
        }
    };

    const isDisabled = (date) => {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        return excludedDays.includes(dayName);
    };
    useEffect(() => {
        getCalendar()
        getExcludeDays()
        getAppointments(moment().format('YYYY-MM-DD'))
    }, [])
    useEffect(() => {
        getCalendar(selectedMonth)

    }, [selectedMonth])



    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 500 }}>
                    Appointments
                </Typography>
                <Calendar
                    style={{

                        margin: "0 auto",
                        width: '80%',
                        height: '400px',
                        overflowY: 'scroll'

                    }}

                    onChange={handleMonthChange}
                    disabledDate={isDisabled}
                    renderCell={renderCell}
                />
                <Typography variant="h4" sx={{ mt: 4,mb:4, fontWeight: 500 }}>
                    Booked  Appointments
                </Typography>
                {loader ? <Box sx={{ margin: '20px auto', display: 'flex', justifyContent: 'center' }}><CircularProgress /> </Box> : <DataTable data={data} columns={columns} />}

            </Paper>
        </div>
    )
}

export default Appointments;
