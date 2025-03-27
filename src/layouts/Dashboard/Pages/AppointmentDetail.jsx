import { Avatar, Button, Chip, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import moment from "moment";
import { useLocation, useParams } from "react-router-dom"
import ApiServices from "../../../services/Apis";
import { useEffect, useState } from "react";


const AppointmentDetail = () => {
    const { state } = useLocation()
    const { id } = useParams()
    const [data, setData] = useState(null)
    console.log(state);

    const getData = async () => {
        try {
            let params = {
                id: id,

            };

            const data = await ApiServices.getAppointmentDetail(params);

            console.log(data);

            setData(data?.data?.booking)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    useEffect(() => {
        getData()
    }, [])


    return (
        <div>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                Appointment Detail
            </Typography>

            <Grid container xs={12} spacing={3} sx={{ border: "1px solid #ddd", borderRadius: 2, margin: '0 auto', p: 2 }}>


                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>First Name:</strong> {data?.first_name}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>Last Name:</strong> {data?.last_name}
                    </Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>Email:</strong> {data?.email}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>DOB:</strong> {moment(data?.dob).format('MM-DD-YYYY')}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>Phone:</strong> {data?.mobile}
                    </Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>Address:</strong> {data?.address}
                    </Typography>
                </Grid>

                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>City:</strong> {data?.city}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="body1">
                        <strong>Country:</strong> {data?.country}
                    </Typography>
                </Grid>
                <Grid item xs={12} display={'flex'} alignItems={'center'}>

                    <strong>Desired Tests:</strong>


                    {data?.desired_tests?.map((test, index) => (
                        <Chip
                            key={index}
                            label={test} // Assuming each test is a string
                            color="primary"
                            sx={{ ml: 1, fontWeight: 600, mt: 1 }} // Add spacing for better layout
                        />
                    ))}
                </Grid>



            </Grid>
            <Grid container xs={12} spacing={3} sx={{ border: "1px solid #ddd", borderRadius: 2, margin: '0 auto', p: 2, mt: 4 }}>
                <Grid container sx={{ p: 2 }}>
                    <Typography variant="h4" sx={{ mb: 0, fontWeight: 500 }}>
                        Demographic Data
                    </Typography>
                </Grid>
                {data?.demographic_information?.map((item) => (
                    <Grid item xs={6} key={item._id}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                            {/* Question */}
                            <Typography variant="h6" fontWeight={600} color="primary">
                                {item.question}
                            </Typography>

                            {/* Description */}
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {item.description}
                            </Typography>

                            {/* Read-Only Radio Buttons */}
                            <RadioGroup value={item.answer}>
                                {item.options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={option}
                                        sx={{ color: 'black' }}
                                        control={<Radio color="primary" />}
                                        label={option}

                                    />
                                ))}
                            </RadioGroup>
                        </Paper>
                    </Grid>
                ))}



            </Grid>

            <Grid container xs={12} spacing={3} sx={{ border: "1px solid #ddd", borderRadius: 2, margin: '0 auto', p: 2, mt: 4 }}>
                <Grid container sx={{ p: 2 }}>
                    <Typography variant="h4" sx={{ mb: 0, fontWeight: 500 }}>
                        Last 5 Years Data
                    </Typography>
                </Grid>
                {data?.last_5_year_data?.map((item) => (
                    <Grid item xs={6} key={item._id}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                            {/* Question */}
                            <Typography variant="h6" fontWeight={600} color="primary">
                                {item.question}
                            </Typography>

                            {/* Description */}
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                {item.description}
                            </Typography>

                            {/* Read-Only Radio Buttons */}
                            <RadioGroup value={item.answer}>
                                {item.options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        value={option}
                                        sx={{ color: 'black' }}
                                        control={<Radio color="primary" />}
                                        label={option}

                                    />
                                ))}
                            </RadioGroup>
                        </Paper>
                    </Grid>
                ))}



            </Grid>

        </div>
    )
}

export default AppointmentDetail
