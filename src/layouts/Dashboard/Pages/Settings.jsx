import { useForm, Controller } from "react-hook-form";
import { Box, Grid, Typography, Button, Chip, InputLabel } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ApiServices from "../../../services/Apis";
import { showPromiseToast } from "../../../components/Toaster";
import { PrimaryButton } from "../../../components/buttons";

const Settings = () => {
    let suggestedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const [selectedChips, setSelectedChips] = useState([])
    const [timeData, setTimeData] = useState(null)
    const [loader, setLoader] = useState(false)
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            startTime: null,
            endTime: null,
            breakStartTime: null,
            breakEndTime: null
        }
    });

    const getData = async () => {
        try {


            const data = await ApiServices.getSettings();
            console.log(data);
            setTimeData(data?.data?.settings)



            setSelectedChips(data?.data?.settings?.exclude_days)




        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    const handleClick = (item) => {
        console.log(item);
        
        setSelectedChips((prevSelected) => {
            const name = typeof item === "string" ? item : item; // This line is redundant, just use item directly
            const isAlreadySelected = prevSelected.includes(name); // Use includes() for clarity
    
            if (isAlreadySelected) {
                console.log("Removing:", name);
                return prevSelected.filter((chip) => chip !== name); // Strict comparison to remove
            } else {
                console.log("Adding:", name);
                return [...prevSelected, name]; // Add new item
            }
        });
    };
    
    
console.log(selectedChips);


    const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    const onSubmit = async (data) => {
        setLoader(true);
       

        try {
            let obj = {

                break_start: formatTime(data.breakStartTime),
                break_end: formatTime(data.breakEndTime),
                start_time: formatTime(data.startTime),
                end_time: formatTime(data.endTime),
                exclude_days: selectedChips

            };
            console.log(obj);


            const promise = ApiServices.UpdateSettings(obj);

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
        } finally {
            setLoader(false);
        }
    };
    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if (!timeData) return;

        console.log(timeData);

        const defaultStartTime = timeData.start_time
            ? dayjs(timeData.start_time, "HH:mm")
            : dayjs().hour(9).minute(0);

        const defaultEndTime = timeData.end_time
            ? dayjs(timeData.end_time, "HH:mm")
            : dayjs().hour(17).minute(0);

        const defaultBreakStartTime = timeData.break_start
            ? dayjs(timeData.break_start, "HH:mm")
            : dayjs().hour(12).minute(0);

        const defaultBreakEndTime = timeData.break_end
            ? dayjs(timeData.break_end, "HH:mm")
            : dayjs().hour(12).minute(30);

        setValue("startTime", defaultStartTime);
        setValue("endTime", defaultEndTime);
        setValue("breakStartTime", defaultBreakStartTime);
        setValue("breakEndTime", defaultBreakEndTime);
    }, [timeData]);



    return (
        <div>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>
                Settings
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid item xs={6} display={'flex'} gap={2}>
                            <Box>
                                <Controller
                                    name="startTime"
                                    control={control}
                                    rules={{ required: "Start time is required" }}
                                    render={({ field }) => (
                                        <TimePicker
                                            ampm={false}
                                            label="Start Time"
                                            {...field}
                                            value={field.value || null}
                                            onChange={(newValue) => field.onChange(newValue)}
                                        />
                                    )}
                                />
                                {errors.startTime && (
                                    <Typography color="error">{errors.startTime.message}</Typography>
                                )}
                            </Box>
                            <Box>
                                <Controller
                                    name="endTime"
                                    control={control}
                                    rules={{ required: "End time is required" }}
                                    render={({ field }) => (
                                        <TimePicker
                                            ampm={false}
                                            label="End Time"
                                            {...field}
                                            value={field.value || null}
                                            onChange={(newValue) => field.onChange(newValue)}
                                        />
                                    )}
                                />
                                {errors.endTime && (
                                    <Typography color="error">{errors.endTime.message}</Typography>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={6} display={'flex'} gap={2}>
                            <Box>
                                <Controller

                                    name="breakStartTime"
                                    control={control}
                                    rules={{ required: "Break start time is required" }}
                                    render={({ field }) => (
                                        <TimePicker
                                            ampm={false}
                                            label="Break Start Time"
                                            {...field}
                                            value={field.value || null}
                                            onChange={(newValue) => field.onChange(newValue)}
                                        />
                                    )}
                                />
                                {errors.breakStartTime && (
                                    <Typography color="error">{errors.breakStartTime.message}</Typography>
                                )}
                            </Box>
                            <Box>


                                <Controller
                                    name="breakEndTime"
                                    control={control}
                                    rules={{ required: "Break end time is required" }}
                                    render={({ field }) => (
                                        <TimePicker
                                            ampm={false}
                                            label="Break End Time"
                                            {...field}
                                            value={field.value || null}
                                            onChange={(newValue) => field.onChange(newValue)}
                                        />
                                    )}
                                />
                                {errors.breakEndTime && (
                                    <Typography color="error">{errors.breakEndTime.message}</Typography>
                                )}
                            </Box>
                        </Grid>

                    </LocalizationProvider>
                </Grid>
                <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mt: 4 }}>

                    Excluded Days
                </InputLabel>
                {suggestedDays.map((item, index) => {
                    const name = typeof item === "string" ? item : item;
                    const isSelected = selectedChips.some((chip) => chip === name);

                    return (
                        <Chip
                            key={name} // Use name instead of id
                            label={name}
                            sx={{
                                backgroundColor: isSelected ? "#ed2b2b" : "transparent",
                                border:  isSelected ? "1px solid #ed2b2b"  :  "1px solid #18A5C3",
                                borderRadius: "6px",
                                color: isSelected ? "white" : "#18A5C3",
                                fontFamily: "Poppins, sans-serif",
                                width: "100px",
                                fontWeight: "bold",
                                m: 1,
                                mb: 0,
                                "&:hover": {
                                    backgroundColor: isSelected ? "#0BD1D1" : "transparent",
                                },
                            }}
                            onClick={() => handleClick(name)}
                        />
                    );
                })}

                <Box display={'flex'} justifyContent={'flex-end'} mt={4}>
                    <PrimaryButton loader={loader} disabled={loader}type={'submit'} title={"Update Settings"} />
                </Box>
            </Box>
        </div>
    );
};

export default Settings;
