import { useForm, Controller } from "react-hook-form";
import { Box, Grid, Typography, Button, Chip, InputLabel, IconButton } from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ApiServices from "../../../services/Apis";
import { showPromiseToast } from "../../../components/Toaster";
import { PrimaryButton } from "../../../components/buttons";
import SelectField from "../../../components/select";
import InputField from "../../../components/input";
import DataTable from "../../../components/DataTable";
import moment from "moment";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ConfirmationDialog from "../../../components/confirmDialog";

const BlockSlots = () => {
    let suggestedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const [selectedChips, setSelectedChips] = useState([])
    const [timeData, setTimeData] = useState(null)
    const [loader, setLoader] = useState(false)
    const [selectedDates, setSelectedDates] = useState([]);
    const [timeSlot, setTimeSlot] = useState(null)

    const handleDateChange = (newDate) => {
        const formattedDate = dayjs(newDate).format("YYYY-MM-DD");

        setSelectedDates((prevDates) => {
            if (prevDates.includes(formattedDate)) {
                return prevDates.filter((date) => date !== formattedDate);
            } else {
                return [...prevDates, formattedDate];
            }
        });
    };
    const { control, handleSubmit, setValue, register, formState: { errors }, watch, getValues, reset
} = useForm();

const getData = async () => {
    try {


        const data = await ApiServices.getBlockSlots();
        console.log(data);
        setData(data?.data?.blockedSlots)




    } catch (error) {
        console.error("Error fetching location:", error);
    }
};
const handleClick = (item) => {
    console.log(item);

    setSelectedChips((prevSelected) => {
        const name = typeof item === "string" ? item : item;
        const isAlreadySelected = prevSelected.some((chip) => chip === name);

        if (isAlreadySelected) {
            console.log("Removing:", name);
            return prevSelected.filter((chip) => chip == name);
        } else {
            console.log("Adding:", name);
            return [...prevSelected, name]; // Store only the name
        }
    });
};

console.log(watch());
const [data, setData] = useState()
const [confirmationDialog, setConfirmationDialog] = useState(false)
const [selectedRow, setSelectedRow] = useState(null)




const columns = [
    {
        header: "Created At",
        accessorKey: "created_at",
        cell: ({ getValue }) => moment(getValue()).format("MM-DD-YYYY"),
    },
    {
        header: "Date",
        accessorKey: "date",
        cell: ({ getValue }) => moment(getValue()).format("MM-DD-YYYY"),
    },
    {
        header: "TimeSlot",
        accessorKey: "timeslot",
        cell: ({ getValue }) => {
            const timeslot = getValue();
            return (
                <Box>
                    {timeslot}
                </Box>
            );
        },
    },
    {
        header: "Duration",
        accessorKey: "duration",
        cell: ({ getValue }) => {
            const duration = getValue();
            return (
                <Box>
                    {duration}
                </Box>
            );
        },
    },
    {
        header: "Reason",
        accessorKey: "reason",
        cell: ({ getValue }) => {
            const reason = getValue();
            return (
                <Box>
                    {reason}
                </Box>
            );
        },
    },
    {
        header: "Actions",
        cell: ({ row }) => (

            <Box variant="contained" color="primary" sx={{ cursor: 'pointer', display: 'flex', gap: 2 }} >

             
                
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

        const promise = ApiServices.DeleteBlockSlot(obj);

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

const formatTime = (isoString) => new Date(isoString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
const onSubmit = async (data) => {
    setLoader(true);
    console.log(selectedDates);
    const transformedArray = selectedDates.map(date => ({
        date: date,
        timeslot: formatTime(getValues('timeSlot')),
        duration: Number(timeSlot?.id),
        reason: getValues('reason')

    }));

    console.log(transformedArray);

    try {
        let obj = {

            slots: transformedArray

        };
        console.log(obj);


        const promise = ApiServices.AddBlockSlots(obj);

        // Handle the API response properly
        const response = await promise;
        console.log(response);

        showPromiseToast(
            promise,
            "Saving...",
            "Added Successfully",
            "Something Went Wrong"
        );
        getData()
        reset()
        setTimeSlot(null)
        setSelectedDates([])
     
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
          <ConfirmationDialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                message={"Are you sure you want to delete?"}
                action={async () => {
                    setConfirmationDialog(false);
                    HandleDelete()

                }}
            />
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
            BlockSlots
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={5}>
                        <Box>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 1 }}>
                                Dates :*
                            </InputLabel>
                            <Controller
                                name="selectedDates"
                                control={control}
                                rules={{ required: selectedDates?.length > 0 ? false : "Please select at least one date" }}
                                render={({ field }) => (
                                    <>
                                        <DatePicker
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    fullWidth: true,
                                                    sx: {
                                                        "& .MuiOutlinedInput-root": {
                                                            "& fieldset": { border: "2px solid black" }, // Default border
                                                            "&:hover fieldset": { border: "2px solid black" }, // On hover
                                                            "&.Mui-focused fieldset": { border: "2px solid black !important" } // On focus
                                                        }
                                                    }
                                                }
                                            }}
                                            value={null}
                                            onChange={handleDateChange}
                                        />
                                        <Box mt={1}>
                                            {selectedDates.map((date) => (
                                                <Chip
                                                    key={date}
                                                    label={date}
                                                    onDelete={() =>
                                                        setSelectedDates((prev) =>
                                                            prev.filter((d) => d !== date)
                                                        )
                                                    }
                                                    sx={{ margin: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                        <input
                                            type="hidden"
                                            {...field}
                                            value={JSON.stringify(selectedDates)}
                                        />
                                    </>
                                )}
                            />
                            {errors.selectedDates && (
                                <Typography color="error">
                                    {errors.selectedDates.message}
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={5} display={'flex'} gap={2}>
                        <Box width="100%">
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 1 }}>
                                Time Slot :*
                            </InputLabel>
                            <Controller
                                name="timeSlot"
                                control={control}
                                rules={{ required: "Time Slot is required" }}
                                render={({ field }) => (
                                    <TimePicker
                                        ampm={false}
                                        {...field}
                                        value={field.value || null}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                fullWidth: true,
                                                sx: {
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { border: "2px solid black" }, // Default border
                                                        "&:hover fieldset": { border: "2px solid black" }, // On hover
                                                        "&.Mui-focused fieldset": { border: "2px solid black !important" } // On focus
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )}
                            />
                            {errors.timeSlot && (
                                <Typography color="error">{errors.timeSlot.message}</Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={5}>
                        <SelectField
                            size={'small'}
                            label={'Duration :*'}
                            options={[
                                { id: "30", name: "30" },
                                { id: "60", name: "60" },
                                { id: "90", name: "90" },
                                { id: "120", name: "120" }
                            ]}
                            selected={timeSlot}
                            onSelect={(value) => setTimeSlot(value)}
                            error={errors?.duration?.message}
                            register={register("duration", {
                                required: 'Please select duration.',
                            })}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { border: "2px solid black" }, // Default border
                                    "&:hover fieldset": { border: "2px solid black" }, // On hover
                                    "&.Mui-focused fieldset": { border: "2px solid black !important" } // On focus
                                }
                            }}
                        />
                    </Grid>
                </LocalizationProvider>
                <Grid item xs={5}><InputField
                    label={"Reason :*"}
                    size={'small'}
                    multiline
                    rows={4}
                    placeholder={"Reason "}
                    error={errors?.reason?.message}
                    register={register("reason", {
                        required:
                            "Please enter your reason."

                    })}
                /></Grid>

            </Grid>


            <Box display={'flex'} justifyContent={'flex-end'} mt={4}>
                <PrimaryButton loader={loader} disabled={loader}type={'submit'} title={"Submit"} />
            </Box>


        </Box>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 500,mt:2 }}>
            Blocked Slots
        </Typography>
        {data?.length > 0 && <DataTable data={data} columns={columns} />}
    </div>
);
};

export default BlockSlots;
