
import {

    Box,

    CardMedia,
    Button,
    IconButton,
    CircularProgress,
    Paper,
    TextField,
    InputAdornment,
    Typography,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";


import { useForm } from "react-hook-form";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
// import AuthServices from "../../apis/auth/AuthServices";

import { useContext, useEffect, useState } from "react";

import ApiServices from "../../../services/Apis";
import OTPInput from "react-otp-input";
import { showErrorToast, showSuccessToast } from "../../../components/Toaster";
import { AuthContext } from "../../../Context/AuthContext";
import { Images } from "../../../assets/images";




function Login() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailConfirmation, setEmailConfirmation] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [otpError, setOtpError] = useState(false)
    const [otpEnable, setOtpEnable] = useState(false);
    const [loginState, setLoginState] = useState(true)
    const [otp, setOtp] = useState('')
    const [otpToken, setOtpToken] = useState(false)
    const [updatePassword, setUpdatePassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [newloader, setNewloader] = useState(false)


    const { user, setUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm();
    const {
        register: register3,
        handleSubmit: handleSubmit3,
        setValue: setValue3,
        getValues: getValues3,
        reset: reset3,
        formState: { errors: errors3 },
    } = useForm();

    const {
        register: register4,
        handleSubmit: handleSubmit4,
        setValue: setValue4,
        getValues: getValues4,
        reset: reset4,
        formState: { errors: errors4 },
    } = useForm();

    const [timer, setTimer] = useState(10);

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


    const SendOtp = async (val) => {
        if (val != 'resend') {
            setIsLoading(true)
        }


        setTimer(60);
        try {
            let obj = {
                email: getValues3('email')
            };

            const data = await ApiServices.SendOtp(obj);
            console.log(data);
            if (data.responseCode == 206) {

                setEmailConfirmation(false)
                setLoginState(false)
                setOtpEnable(true)
                setEmailError(false)
            }
        } catch (error) {

            setEmailError(true)
        }
        finally {
            setIsLoading(false)
            setNewloader(false)
        }
    }

    const SubmitOTP = async (val) => {

        setIsLoading(true)



        try {
            let obj = {
                email: getValues3('email'),
                otp: otp,
            };

            const data = await ApiServices.SendOtp(obj);
            console.log(data?.data, 'tesetttt');
            if (data.responseCode == 206) {

                setOtpToken(data?.data?.otp_token)
                setUpdatePassword(true)
                setEmailConfirmation(false)
                setOtpEnable(false)
                setConfirmPassword(true)
                // Register(sendData, data?.data?.otp_token);
            }
        } catch (error) {
            setOtpError(true)
        }
        finally {
            setIsLoading(false)

        }
    };

    const UpdatePassword = async (sendData, result) => {
        setIsLoading(true)
        console.log(otpToken, "otpToken2");
        try {
            let obj = {
                otp_token: otpToken,
                email: getValues3('email'),
                password: getValues4('password'),
                confirm_password: getValues4('confirmPassword'),
            };

            const data = await ApiServices.SendOtp(obj);
            console.log(data);
            if (data.responseCode == 200) {
                setOtp('')

                reset4()
                setConfirmPassword(false)
                setLoginState(true)


            }
        } catch (error) {
            setOtpError(true)
        }
        finally {
            setIsLoading(false)
        }
    };
    //   const { userLogin } = useAuth();
    const navigate = useNavigate();

    const submit = async (formData) => {
        setIsLoading(true);
        const obj = {
            email: formData.email,
            password: formData.password,
        };
        try {
            const result = await ApiServices.Login(obj);
            if (result.responseCode == 200) {
                // userLogin(result.data);


                setUser(result?.data);
                localStorage.setItem('user', JSON.stringify(result?.data))
                showSuccessToast(result.message);
                navigate("/dashboard");
            }
        } catch (error) {
            showErrorToast(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
        sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${Images?.loginBg})`, // Corrected syntax
            backgroundSize: "cover", // Ensures the image covers the entire background
            backgroundPosition: "center", // Centers the image
            position: "relative", // Required for absolute positioning of pseudo-element
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(239, 246, 255, 0.5)", // Semi-transparent overlay
                zIndex: 1,
            },
        }}
        

        >
            <Paper
                elevation={3}
                sx={{
                    position: "relative",
                    // border: "2px solid #0052a8",
                    zIndex: 2, // Ensure it appears above the overlay
                    padding: { xs: "20px", sm: "30px", md: "40px" },
                    borderRadius: "16px",
                    width: { xs: "80%", sm: "30%", md: "25%" },
                    textAlign: "center",
                    backgroundColor: "white",
                    boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px", // Corrected shadow
        
                }}
                
            >
                <Box sx={{ display: 'flex', justifyContent: "center", mb: 4, }}>
                    <CardMedia
                        component={"img"}
                        src={Images.logo}
                        alt={"logo"}
                        sx={{
                            width: '120px',
                            borderRadius: "50%",
                            objectFit: "contain",
                        }}
                    />
                </Box>

                {loginState && <form onSubmit={handleSubmit(submit)}>

                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        sx={{
                            borderRadius: "12px",
                            ".MuiOutlinedInput-root": {
                              border: "2px solid #e0e0e0",
                              borderRadius: "12px",
                              outline: "none",
                              transition: "all 0.2s ease-in-out",
                              "& fieldset": { border: "none" },
                              "&:hover": {
                                border: "2px solid #0076bf",
                              },
                              "&.Mui-focused": {
                                border: "2px solid #0076bf",
                                "& fieldset": { border: "none" },
                                svg: {
                                  path: {
                                    fill: "#0076bf",
                                  },
                                },
                              },
                            },
                          
                          }}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Email is not valid",
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                    />

                    <TextField
                        label="Password"
                        type={isVisible ? "text" : "password"}
                        variant="outlined"
                        fullWidth
                        {...register("password", { required: "Password is required" })}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ""}
                        sx={{
                            borderRadius: "12px",
                            mt:4,
                            mb:4,
                            ".MuiOutlinedInput-root": {
                              border: "2px solid #e0e0e0",
                              borderRadius: "12px",
                              outline: "none",
                              transition: "all 0.2s ease-in-out",
                              "& fieldset": { border: "none" },
                              "&:hover": {
                                border: "2px solid #0076bf",
                              },
                              "&.Mui-focused": {
                                border: "2px solid #0076bf",
                                "& fieldset": { border: "none" },
                                svg: {
                                  path: {
                                    fill: "#0076bf",
                                  },
                                },
                              },
                            },
                           
                          }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsVisible(!isVisible)}
                                        edge="end"
                                        sx={{
                                            ':focus': {
                                                outline: 'none !important'
                                            }
                                        }}
                                    >
                                        {isVisible ? <VisibilityOff sx={{ color: "#0F172A", fontSize: "20px" }} /> : <Visibility sx={{ color: "#0F172A", fontSize: "20px" }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', fontSize: '13px', mb: 2 }}>
                        <span style={{ textAlign: 'right' }} onClick={() => { setLoginState(false); setEmailConfirmation(true) }}>Forget Password?</span>
                    </Box> */}
                    <Button
                        type={"submit"}
                        fullWidth
                        variant={"contained"}
                        sx={{
                            background: " #0052a8",
                            color: 'white',
                            borderRadius: "8px",
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
                            "Login"
                        )}
                    </Button>
                </form>}

                {emailConfirmation && <form onSubmit={handleSubmit3(SendOtp)}>

                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        sx={{
                            mb: 3,
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                                borderColor: 'rgb(182, 182, 182)',
                            },
                            "& label.Mui-focused": {
                                color: 'black',
                            },
                            fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive font size
                        }}
                        {...register3("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                                message: "Email is not valid",
                            },
                        })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                    />



                    <Button
                        type={"submit"}
                        fullWidth
                        variant={"contained"}
                        sx={{
                            background: " #18A5C3",
                            color: 'white',
                            borderRadius: "8px",
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
                </form>}
                {
                    otpEnable && (
                        <>
                            <Typography
                                className="heading-font"
                                variant="h5"
                                mb={2}
                                sx={{
                                    fontWeight: 600,
                                    textAlign: "center",
                                    fontFamily: "Plus Jakarta Sans",
                                }}
                            >
                                Enter OTP
                            </Typography>
                            <div className="otp-container">
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={4}
                                    renderSeparator={<span className="separator">-</span>}
                                    renderInput={(props) => (
                                        <input className="otp-input" {...props} />
                                    )}
                                />
                            </div>{" "}
                            {otpError && <span style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}> &nbsp; OTP is Invalid </span>}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                                <span style={{ fontSize: "14px", color: "#6B7280" }}>
                                    Resend OTP in {timer}s
                                </span>
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
                                onClick={() => SubmitOTP()}
                                fullWidth
                                variant={"contained"}
                                sx={{
                                    background: " #18A5C3",
                                    color: 'white',
                                    borderRadius: "8px",
                                    textTransform: 'capitalize',
                                    p: "14px 40px",
                                    "&.Mui-disabled": {
                                        background: "#337DBD",
                                    },
                                }}
                                disabled={(isLoading) || otp.length != 4}
                            >
                                {(isLoading) ? (
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
                        </>
                    )
                }

                {confirmPassword && (
                    <>
                        <Box sx={{ width: "100%" }} component={'form'} onSubmit={handleSubmit4(UpdatePassword)}>
                            <Typography
                                className="heading-font"
                                variant="h5"
                                mb={2}
                                sx={{
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    fontFamily: "Plus Jakarta Sans",

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
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default Login;