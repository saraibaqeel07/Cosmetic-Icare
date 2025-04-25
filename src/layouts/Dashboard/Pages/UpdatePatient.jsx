import { useEffect, useRef, useState } from "react";
import ApiServices from "../../../services/Apis";
import { PrimaryButton } from "../../../components/buttons";
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, InputAdornment, InputLabel, Paper, TextField, Typography } from "@mui/material";
import InputField from "../../../components/input";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showErrorToast, showPromiseToast, showSuccessToast } from "../../../components/Toaster";
import UploadIcon from "@mui/icons-material/Upload";
import OTPInput from "react-otp-input";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SelectField from "../../../components/select";
import dayjs from "dayjs";


const UpdatePatient = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [userData, setUserData] = useState(null)
    const { register, control, handleSubmit, setValue, getValues, formState: { errors }, reset, watch } = useForm();
    const [title, setTitle] = useState(null)

    const [step, setStep] = useState(1); // 1: OTP, 2: Reset Password
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword2, setShowPassword2] = useState(false);
    const [otpToken, setOtpToken] = useState(null)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register: register4,
        handleSubmit: handleSubmit4,
        setValue: setValue4,
        getValues: getValues4,
        reset: reset4,
        formState: { errors: errors4 },
    } = useForm();

    // Simulate OTP Submission
    const handleOtpSubmit = () => {
        if (otp.length !== 4) {
            setOtpError(true);
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            SubmitOTP()
            setStep(2); // Move to reset password step
        }, 2000);
    };

    // Simulate Reset Password Submission
    const handleResetSubmit = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // Close dialog after password reset
        }, 2000);
    };
    const fileInputRef = useRef(null);

    const [loader, setLoader] = useState(false)

    const [imageURL, setImageURL] = useState()
    const [hovered, setHovered] = useState(false);




    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                setValue("image", file, { shouldValidate: true }); // Set value and trigger validation
            }
            const formData = new FormData();
            formData.append("document", e.target.files[0]);

            const response = await axios.post(
                'https://cosmetic.theappkit.com/api/system/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log(response?.data?.data?.patient?.path);

            setImageURL( response?.data?.data?.patient?.path);


        } catch (error) {
            console.log(error);

        }
    };
    const UpdatePatient = async () => {
        setLoader(true);
        try {
            let obj = {
                _id: id,
                title: title?.id,
                first_name: getValues('fname'),
                last_name: getValues('lname'),
                dob: getValues('selectedDate'),
                address: getValues('address'),
                email: getValues('email'),
                post_code: getValues('post'),
                phone: getValues('phone'),
                notes: getValues('notes'),
                picture: imageURL,
                kin_details: {
                    name: getValues('name'),
                    address: getValues('kinaddress'),
                    email: getValues('kinemail'),
                    phone: getValues('kinphone'),
                },
                general_practitioner: {
                    name: getValues('genname'),
                    address: getValues('genaddress'),
                    email: getValues('genemail'),
                    phone: getValues('genphone'),
                },

            };

            const promise = ApiServices.UpdatePatient(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);

            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );

            // Navigate if response is successful
            if (response?.responseCode === 200) {
                console.log(response);
                setImageURL(null)
                navigate('/patients')


            }

        } catch (error) {
            console.log(error);
            showErrorToast(error)
        } finally {

            setLoader(false);
        }
    };

    const SendOtp = async (val) => {
        if (val != 'resend') {
            setIsLoading(true)
        }


        setTimer(60);
        try {
            let obj = {
                email: userData?.email
            };

            const data = await ApiServices.SendOtp(obj);
            console.log(data);
            if (data.responseCode == 206) {
                setOtp('')
                showSuccessToast('Otp Sent Successfully')

            }

        } catch (error) {

            console.log(error)
        }
        finally {
            setIsLoading(false)
            setStep(1)
            setOpen(true)

        }
    }

    const UpdatePassword = async (sendData, result) => {
        setIsLoading(true)
        console.log(otpToken, "otpToken2");
        try {
            let obj = {
                otp_token: otpToken,
                email: userData?.email,
                password: getValues4('password'),
                confirm_password: getValues4('confirmPassword'),
            };

            const data = await ApiServices.SendOtp(obj);
            console.log(data);
            if (data.responseCode == 200) {
                setOtp('')

                reset4()
                setConfirmPassword(false)



            }
        } catch (error) {
            setOtpError(true)
        }
        finally {
            setIsLoading(false)
            setOpen(false)
            showSuccessToast('Password Reset Successfully')
        }
    };

    const SubmitOTP = async (val) => {

        setIsLoading(true)



        try {
            let obj = {
                email: userData?.email,
                otp: otp,
            };

            const data = await ApiServices.SendOtp(obj);
            console.log(data?.data, 'tesetttt');
            if (data.responseCode == 206) {
                console.log(data);
                setOtpToken(data?.data?.patient?.otp_token)


            }
        } catch (error) {
            setOtpError(true)
        }
        finally {
            setIsLoading(false)

        }
    };

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);
    const getData = async () => {
        try {

            let params = {
                id: id
            }
            const data = await ApiServices.GetPatientDetails(params);


            console.log(data);
            setUserData(data?.data?.patient)
            setValue('fname', data?.data?.patient?.first_name)
            setValue('lname', data?.data?.patient?.last_name)
            setValue('phone', data?.data?.patient?.phone)
            setValue('email', data?.data?.patient?.email)
            setValue('post', data?.data?.patient?.post_code)
            setValue('address', data?.data?.patient?.address)
            setValue('notes', data?.data?.patient?.notes)
            setTitle({ id: data?.data?.patient?.title, name: data?.data?.patient?.title })
            setValue('title', { id: data?.data?.patient?.title, name: data?.data?.patient?.title })
            // Convert date string to a Day.js object
            const dob = data?.data?.patient?.dob ? dayjs(data.data.patient.dob) : null;
            setValue('selectedDate', dob); // Set value for DatePicker
            // setValue('selectedDate', data?.data?.patient?.dob)
            setImageURL(data?.data?.patient?.picture)
            setValue("image", { shouldValidate: true });
            setValue('name', data?.data?.patient?.kin_details?.name)
            setValue('kinemail', data?.data?.patient?.kin_details?.email)
            setValue('kinphone', data?.data?.patient?.kin_details?.phone)
            setValue('kinaddress', data?.data?.patient?.kin_details?.address)
            setValue('genname', data?.data?.patient?.general_practitioner?.name)
            setValue('genemail', data?.data?.patient?.general_practitioner?.email)
            setValue('genphone', data?.data?.patient?.general_practitioner?.phone)
            setValue('genaddress', data?.data?.patient?.general_practitioner?.address)

        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">

                <DialogContent>
                    {step === 1 ? (
                        // OTP Verification Step
                        <Box>
                            <Typography
                                className="heading-font"
                                variant="h5"
                                mb={2}
                                sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",


                                }}
                            >
                                Enter OTP
                            </Typography>
                            <div className="otp-container" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                <OTPInput
                                    value={otp}
                                    onChange={(otp) => {
                                        setOtp(otp);
                                        setOtpError(false);
                                    }}
                                    numInputs={4}
                                    renderSeparator={<span className="separator">-</span>}
                                    renderInput={(props) => (
                                        <input
                                            className="otp-input"
                                            {...props}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                textAlign: "center",
                                                fontSize: "18px",
                                                border: "1px solid #ccc",
                                                borderRadius: "5px",
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {otpError && (
                                <span style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>
                                    &nbsp; OTP is Invalid
                                </span>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                            >
                                <span style={{ fontSize: "14px", color: "#6B7280" }}>Resend OTP in {timer}s</span>
                                <Button
                                    variant="text"
                                    disabled={timer > 0}
                                    onClick={() => SendOtp('resend')}
                                    sx={{
                                        fontSize: "14px",
                                        textTransform: "capitalize",
                                        color: timer > 0 ? "#9CA3AF" : "#0EA5EA",
                                    }}
                                >
                                    Resend
                                </Button>
                            </div>
                            <Button
                                onClick={handleOtpSubmit}
                                fullWidth
                                variant="contained"
                                sx={{
                                    background: "#18A5C3",
                                    color: "white",
                                    borderRadius: "8px",
                                    textTransform: "capitalize",
                                    p: "14px 40px",
                                    mt: 2,
                                }}
                                disabled={isLoading || otp.length !== 4}
                            >
                                {isLoading ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Submit"}
                            </Button>
                        </Box>
                    ) : (
                        // Reset Password Step
                        <Box sx={{ width: "100%" }} component={'form'} onSubmit={handleSubmit4(UpdatePassword)}>
                            <Typography
                                className="heading-font"
                                variant="h5"
                                mb={2}
                                sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",


                                }}
                            >
                                Reset Password
                            </Typography>
                            {/* Password Field */}
                            <TextField
                                fullWidth
                                placeholder="Password"
                                variant="outlined"

                                type={showPassword ? "text" : "password"}
                                {...register4("password", {
                                    required: "Password is required",
                                })}
                                error={!!errors4.password}
                                helperText={
                                    errors4.password ? errors4.password.message : ""
                                }
                                InputProps={{

                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{
                                                    ":focus": {
                                                        outline: "none !important"
                                                    }
                                                }}
                                            >
                                                {showPassword ? (
                                                    <VisibilityIcon
                                                        sx={{ color: "#0F172A", fontSize: "20px" }}
                                                    />
                                                ) : (
                                                    <VisibilityOffIcon
                                                        sx={{ color: "#0F172A", fontSize: "20px" }}
                                                    />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    style: {
                                        color: "#0F172A",
                                        fontSize: "16px",
                                        borderRadius: 8, // Rounded corners
                                    },
                                }}
                                sx={{
                                    my: 1,
                                    backgroundColor: "#1E1E1E", // Dark background color
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "white",
                                        "& fieldset": { borderColor: "rgb(182, 182, 182)" }, // Blue border
                                        "&:hover fieldset": { borderColor: "rgb(182, 182, 182)" },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "rgb(182, 182, 182)",
                                        },
                                    },
                                    "&.MuiFormControl-fullWidth": {
                                        background: "transparent !important",
                                        borderRadius: '10px !important'
                                    },
                                    "& .MuiInputLabel-root": { color: "black" },
                                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                                }}
                            />

                            {/* Confirm Password Field */}
                            <TextField
                                fullWidth
                                placeholder="Confirm Password"

                                variant="outlined"
                                type={showPassword2 ? "text" : "password"}
                                {...register4("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (value) =>
                                        value === getValues4("password") ||
                                        "Passwords do not match",
                                })}
                                error={!!errors4.confirmPassword}
                                helperText={
                                    errors4.confirmPassword
                                        ? errors4.confirmPassword.message
                                        : ""
                                }
                                InputProps={{

                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword2(!showPassword2)}
                                                edge="end"
                                                sx={{
                                                    ":focus": {
                                                        outline: "none !important"
                                                    }
                                                }}
                                            >
                                                {showPassword2 ? (
                                                    <VisibilityIcon
                                                        sx={{ color: "#0F172A", fontSize: "20px" }}
                                                    />
                                                ) : (
                                                    <VisibilityOffIcon
                                                        sx={{ color: "#0F172A", fontSize: "20px" }}
                                                    />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    style: {
                                        color: "#0F172A",
                                        fontSize: "16px",
                                        borderRadius: 8, // Rounded corners
                                    },
                                }}
                                sx={{
                                    my: 1,
                                    backgroundColor: "#1E1E1E", // Dark background color
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "white",
                                        "& fieldset": { borderColor: "rgb(182, 182, 182)" }, // Blue border
                                        "&:hover fieldset": { borderColor: "rgb(182, 182, 182)" },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "rgb(182, 182, 182)",
                                        },
                                    },
                                    "&.MuiFormControl-fullWidth": {
                                        background: "transparent !important",
                                        borderRadius: '10px !important'
                                    },
                                    "& .MuiInputLabel-root": { color: "black" },
                                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                                }}
                            />

                            <Button
                                type={"submit"}
                                fullWidth
                                variant={"contained"}
                                sx={{
                                    background: " #18A5C3",
                                    color: 'white',
                                    borderRadius: "8px",
                                    mt: 2,
                                    textTransform: 'capitalize',
                                    p: "14px 40px",
                                    "&.Mui-disabled": {
                                        background: "#337DBD",
                                    },
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress
                                        sx={{
                                            "&.MuiCircularProgress-root": {
                                                width: "26px !important",
                                                height: "26px !important",
                                            },
                                            color: 'black',
                                        }}
                                    />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none', backgroundColor: '#ffff', borderRadius: '12px' }}>



                <Box component={'form'} p={3} sx={{ borderRadius: '12px' }} onSubmit={handleSubmit(UpdatePatient)} >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Update Patient
                    </Typography>

                    <Grid container mt={4} spacing={2}>

                        <Grid item xs={10}>
                            <InputLabel sx={{
                                textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>

                                Profile Picture :*
                            </InputLabel>

                            <Controller
                                name="image"
                                control={control}
                                rules={{ required: "Profile picture is required" }}
                                render={() => (
                                    <Box
                                        component={"div"}
                                        onMouseEnter={() => setHovered(true)}
                                        onMouseLeave={() => setHovered(false)}
                                        sx={{
                                            position: "relative",
                                            width: 75,
                                            height: 75,
                                            mt: 2,
                                        }}
                                    >
                                        <Avatar
                                            src={import.meta.env.VITE_BASE_URL+imageURL}
                                            alt="Profile"
                                            sx={{
                                                position: "relative",
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "50%",
                                                fontSize: 24,
                                                backgroundColor: imageURL ? "" : "#0EA5EA",
                                                color: "white",
                                                cursor: "pointer",
                                                objectFit: "cover",
                                                textTransform: "capitalize",
                                            }}
                                            onClick={handleImageClick}
                                        />

                                        {hovered && <IconButton
                                            sx={{
                                                position: "absolute",
                                                top: "0",
                                                left: "0",
                                                width: "100%",
                                                padding: "9px 15px",
                                                color: "white",
                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                borderRadius: "50%",
                                                display: "block",
                                                "&:hover": {
                                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                                },
                                            }}
                                            onClick={handleImageClick}
                                        >
                                            <UploadIcon />
                                            <Box sx={{ fontSize: "12px" }}>Upload Image</Box>
                                        </IconButton>}

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </Box>
                                )}
                            />

                            {(errors.image && !imageURL) && (
                                <Typography sx={{ color: "red", fontSize: "12px", mt: 1 }}>
                                    {errors.image.message}
                                </Typography>
                            )}
                        </Grid>
                        {/* <Grid item xs={5} display={'flex'} alignItems={'flex-end'}>
              <PrimaryButton onClick={() => SendOtp()} title={"Update Password"} />
            </Grid> */}
                        <Grid item xs={3} mt={2}>
                            <InputLabel sx={{
                                textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>

                                Title :*
                            </InputLabel>
                            <SelectField
                                size={'small'}
                                newLabel={'Select Type'}
                                fullWidth={true}
                                options={[{ id: 'Ms', name: 'Ms' }, { id: 'Miss', name: 'Miss' }, { id: 'Mrs', name: 'Mrs' }, { id: 'Mr', name: 'Mr' }]}
                                selected={title}
                                onSelect={(value) => {
                                    setTitle(value)


                                }}
                                error={errors?.title?.message}
                                register={register("title", {
                                    required: 'Please select title.',
                                })}
                            />

                        </Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"First Name :*"}
                            size={'small'}
                            placeholder={"First Name"}
                            error={errors?.fname?.message}
                            register={register("fname", {
                                required:
                                    "Please enter your fname."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Last Name :*"}
                            size={'small'}
                            placeholder={"Last Name"}
                            error={errors?.lname?.message}
                            register={register("lname", {
                                required:
                                    "Please enter your lname."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Email :*"}
                            size={'small'}
                            placeholder={"Email"}
                            error={errors?.email?.message}
                            register={register("email", {
                                required:
                                    "Please enter your email."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid container spacing={2}>
                                    {/* Single Date Selection */}
                                    <Grid item xs={12}>
                                        <Box>
                                            <InputLabel sx={{
                                                textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                                fontSize: "14px",
                                                color: "#333",
                                                marginBottom: 1.5,
                                            }}>
                                                DOB :*
                                            </InputLabel>
                                            <Controller
                                                name="selectedDate"
                                                control={control}
                                                rules={{ required: "Please select a date" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        value={field.value || null}
                                                        onChange={(newValue) => {
                                                            field.onChange(newValue);
                                                            setValue("selectedDate", newValue); // Set value manually
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                fullWidth: true,
                                                                sx: {
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: '12px',
                                                                        "& fieldset": { border: "1px solid #e0e0e0" },
                                                                        "&:hover fieldset": { border: "1px solid #0076bf" },
                                                                        "&.Mui-focused fieldset": { border: "1px solid #0076bf !important" }
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.selectedDate && (
                                                <Typography color="error">{errors.selectedDate.message}</Typography>
                                            )}
                                        </Box>
                                    </Grid>




                                </Grid>


                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Phone Number :*"}
                            size={'small'}
                            placeholder={"Phone Number"}
                            error={errors?.phone?.message}
                            register={register("phone", {
                                required:
                                    "Please enter your phone."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Post Code :*"}
                            size={'small'}
                            placeholder={"Post Code"}
                            error={errors?.post?.message}
                            register={register("post", {
                                required:
                                    "Please enter your postcode."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Address :*"}
                            size={'small'}
                            placeholder={"Address"}
                            error={errors?.address?.message}
                            register={register("address", {
                                required:
                                    "Please enter your address."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Notes :"}
                            multiline
                            rows={3}
                            size={'small'}
                            placeholder={"Notes"}
                            error={errors?.notes?.message}
                            register={register("notes", {
                                required:
                                    false

                            })}
                        /></Grid>


                    </Grid>
                    <Divider sx={{ mt: 4 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
                        Next of Kin Details
                    </Typography>
                    <Grid container mt={4} spacing={2}>


                        <Grid item xs={3} mt={2}><InputField
                            label={"Name :"}
                            size={'small'}
                            placeholder={"Name"}
                            error={errors?.name?.message}
                            register={register("name", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item xs={3} mt={2}><InputField
                            label={"Email :"}
                            size={'small'}
                            placeholder={"Email"}
                            error={errors?.kinemail?.message}
                            register={register("kinemail", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item xs={3} mt={2}><InputField
                            label={"Phone Number :"}
                            size={'small'}
                            placeholder={"Phone Number"}
                            error={errors?.kinphone?.message}
                            register={register("kinphone", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item xs={3} mt={2}><InputField
                            label={"Address :"}
                            size={'small'}
                            placeholder={"Address"}
                            error={errors?.kinaddress?.message}
                            register={register("kinaddress", {
                                required:
                                    false

                            })}
                        /></Grid>



                    </Grid>
                    <Divider sx={{ mt: 4 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 4 }}>
                        General Practitioners(GP / Doctors)
                    </Typography>
                    <Grid container mt={4} spacing={2}>


                        <Grid item xs={3} mt={2}><InputField
                            label={"Name :"}
                            size={'small'}
                            placeholder={"Name"}
                            error={errors?.genname?.message}
                            register={register("genname", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item xs={3} mt={2}><InputField
                            label={"Email :"}
                            size={'small'}
                            placeholder={"Email"}
                            error={errors?.genemail?.message}
                            register={register("genemail", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item xs={3} mt={2}><InputField
                            label={"Phone Number :"}
                            size={'small'}
                            placeholder={"Phone Number"}
                            error={errors?.genphone?.message}
                            register={register("genphone", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item xs={3} mt={2}><InputField
                            label={"Address :"}
                            size={'small'}
                            placeholder={"Address"}
                            error={errors?.genaddress?.message}
                            register={register("genaddress", {
                                required:
                                    false

                            })}
                        /></Grid>



                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader} type={'submit'} title={"Update"} />
                    </Box>
                </Box>
            </Paper>
        </div >
    )
}

export default UpdatePatient
