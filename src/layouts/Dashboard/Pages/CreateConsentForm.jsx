import { useEffect, useRef, useState } from "react";
import ApiServices from "../../../services/Apis";
import { PrimaryButton } from "../../../components/buttons";
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, InputLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import InputField from "../../../components/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import SignatureCanvas from "react-signature-canvas";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";
import { Images } from "../../../assets/images";

const CreateConsentForm = () => {
    const navigate = useNavigate()
    const [markingLoader, setMarkingLoader] = useState(false)
    const [userData, setUserData] = useState(null)
    const { register, control, handleSubmit, setValue, getValues, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            records: [{ date: "", amount: "", description: "" }], // Initial field (cannot be removed)
            furtherFields: [{ date: null, sign: "" }], // Additional dynamic section
        },
    });
    const { fields: furtherFields, append: appendFurther, remove: removeFurther } = useFieldArray({
        control,
        name: "furtherFields",
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "records",
    });

    const sigMarkingRef = useRef(null);
    const [savedImage, setSavedImage] = useState(null);

    const backgroundImage = Images.girl; // Replace with actual image URL

    useEffect(() => {
        const canvas = sigMarkingRef.current.getCanvas();
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }, []);

    const handleClearMarking = () => {
        const canvas = sigMarkingRef.current.getCanvas();
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = backgroundImage;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    };

    const handleSaveMarking = async () => {
        setMarkingLoader(true)
        if (sigMarkingRef.current) {
            const canvas = await sigMarkingRef.current.getCanvas();
            const finalImage = await canvas.toDataURL("image/png");
            try {


                let obj = {
                    document: finalImage,
                    filename: moment().unix() + "_Mapping.png"
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/system/uploadDoc`,
                    obj
                );

                console.log(response?.data?.data?.path);


                setSavedImage(response?.data?.data?.path);


            } catch (error) {
                console.log(error);

            }

            setMarkingLoader(false)
        }
    };
    const signCanvasRefs = useRef([]);

    // Clear Signature Function
    const clearSignature = (index) => {
        if (signCanvasRefs.current[index]) {
            signCanvasRefs.current[index].clear();
            setValue(`furtherFields.${index}.sign`, "");
        }
    };
    // Function to update signature in the form state
    const updateSignature = async (index) => {
        if (signCanvasRefs.current[index]) {
            const signData = await signCanvasRefs.current[index].toDataURL();
            setValue(`furtherFields.${index}.sign`, signData);
            try {
                const file = signData;
                if (file) {
                    setValue("image", file, { shouldValidate: true }); // Set value and trigger validation
                }

                let obj = {
                    document: signData,
                    filename: moment().unix() + "_Sign.png"
                }

                const response = await axios.post(
                    'https://cosmetic.theappkit.com/api/system/uploadDoc',
                    obj
                );

                console.log(response?.data?.data?.path);


                setValue(`furtherFields.${index}.sign`, 'https://cosmetic.theappkit.com' + response?.data?.data?.path);


            } catch (error) {
                console.log(error);

            }
        }
    };
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
    const [patientType, setPatientType] = useState("existing");
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [documents, setDocuments] = useState([])
    const [selectedDocument, setSelectedDocument] = useState(null)
    const sigCanvas = useRef(null);
    const [signature, setSignature] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([])
    const [imageLoader, setImageLoader] = useState(false)
    const [beforeImages, setBeforeImages] = useState([])
    const [imageLoaderBefore, setImageLoaderBefore] = useState(false)
    const [afterImages, setAfterImages] = useState([])
    const [imageLoaderAfter, setImageLoaderAfter] = useState(false)
    const [selectedForm, setSelectedForm] = useState(null)
    const [forms, setForms] = useState([])

    // Handle Save Signature
    const handleSave = async () => {
        if (sigCanvas.current) {
            const dataURL = await sigCanvas.current.toDataURL();
            setSignature(dataURL);
            try {
                const file = dataURL;
                if (file) {
                    setValue("image", file, { shouldValidate: true }); // Set value and trigger validation
                }

                let obj = {
                    document: dataURL,
                    filename: moment().unix() + "_Sign.png"
                }

                const response = await axios.post(
                    'https://cosmetic.theappkit.com/api/system/uploadDoc',
                    obj
                );

                console.log(response?.data?.data?.path);

                setSignature('https://cosmetic.theappkit.com' + response?.data?.data?.path);


            } catch (error) {
                console.log(error);

            }
        }
    };

    // Handle Clear Signature
    const handleClear = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
            setSignature(null);
        }
    };
    const [permissions, setPermissions] = useState({
        marketing: "",
        offers: "",
    });

    const handleChange2 = (event) => {
        setPermissions({
            ...permissions,
            [event.target.name]: event.target.value,
        });
    };
    const handleChange = (event) => {
        setPatientType(event.target.value);
    };
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

            console.log(response?.data?.data?.path);

            setImageURL('https://cosmetic.theappkit.com' + response?.data?.data?.path);


        } catch (error) {
            console.log(error);

        }
    };
    const CreateConsentForm = async (fromData) => {
        setLoader(true);
        console.log(fromData);

        try {
            let obj = {
                patient_id: patientType == 'existing' ? selectedPatient?.id : null,
                form_id: selectedForm?.id,
                aftercare_document: patientType == 'existing' ? selectedDocument?._id : null,
                treatment_date: getValues('treatmentDate'),
                consultation_date: getValues('consultationDate'),
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
                treatment_plan: {
                    patient_concerns: getValues('patientConcerns'),
                    patient_goals: getValues('patientGoal'),
                    advised_plan: getValues('advisedPlan'),
                    expected_result: getValues('expectedResult'),
                    date: getValues('patientDate'),
                    patient_sign: signature
                },
                batch_images: uploadedImages,
                before_images: beforeImages,
                after_images: afterImages,
                further_treatment: fromData?.furtherFields,
                treatment_record: fromData?.records,
                extra_notes: getValues('extranotes'),
                permission_marketing: permissions?.marketing,
                offers: permissions?.offers,
                facial_mapping: savedImage


            };
            console.log(obj);

            const promise = ApiServices.CreateForm(obj);

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
                navigate('/consent-forms')


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
                setOtpToken(data?.data?.otp_token)


            }
        } catch (error) {
            setOtpError(true)
        }
        finally {
            setIsLoading(false)

        }
    };

    const handleFileChange2 = async (e) => {
        setUploadedImages([]);
        setImageLoader(true);

        try {
            const files = e.target.files;
            if (!files || files.length === 0) return; // Exit if no files are selected

            setValue("images", Array.from(files), { shouldValidate: true }); // Ensure files are stored as an array

            const uploadedNewBatchImages = [];

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("document", files[i]);

                console.log("Uploading file:", files[i].name); // Debugging log

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/system/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    const fullImageUrl = imagePath;
                    uploadedNewBatchImages.push(fullImageUrl);
                    console.log("Uploaded Image URL:", fullImageUrl);
                }
            }

            setUploadedImages([...uploadedImages, ...uploadedNewBatchImages]); // Update state with uploaded image URLs
            console.log("All Uploaded Images:", uploadedNewBatchImages);
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setImageLoader(false);
        }
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleFileChange3 = async (e) => {
        setBeforeImages([]);
        setImageLoaderBefore(true);

        try {
            const files = e.target.files;
            if (!files || files.length === 0) return; // Exit if no files are selected

            setValue("images", Array.from(files), { shouldValidate: true }); // Ensure files are stored as an array

            const uploadedNewBeforeImages = [];

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("document", files[i]);

                console.log("Uploading file:", files[i].name); // Debugging log

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/system/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    const fullImageUrl = imagePath;
                    uploadedNewBeforeImages.push(fullImageUrl);
                    console.log("Uploaded Image URL:", fullImageUrl);
                }
            }

            setBeforeImages([...beforeImages, ...uploadedNewBeforeImages]); // Update state with uploaded image URLs
            console.log("All Uploaded Images:", uploadedNewBeforeImages);
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setImageLoaderBefore(false);
        }
    };

    const handleRemoveImage2 = (index) => {
        setBeforeImages(prevImages => prevImages.filter((_, i) => i !== index));
    };
    const handleFileChange4 = async (e) => {
        setAfterImages([]);
        setImageLoaderAfter(true);

        try {
            const files = e.target.files;
            if (!files || files.length === 0) return; // Exit if no files are selected

            setValue("images", Array.from(files), { shouldValidate: true }); // Ensure files are stored as an array

            const uploadedNewAfterImages = [];

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("document", files[i]);

                console.log("Uploading file:", files[i].name); // Debugging log

                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/system/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    const fullImageUrl = imagePath;
                    uploadedNewAfterImages.push(fullImageUrl);
                    console.log("Uploaded Image URL:", fullImageUrl);
                }
            }

            setAfterImages([...afterImages, ...uploadedNewAfterImages]); // Update state with uploaded image URLs
            console.log("All Uploaded Images:", uploadedNewAfterImages);
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setImageLoaderAfter(false);
        }
    };

    const handleRemoveImage3 = (index) => {
        setAfterImages(prevImages => prevImages.filter((_, i) => i !== index));
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

    const getDocuments = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getAfterCareDocuments(params);



            setDocuments(
                data?.data?.documents?.map((doc) => ({

                    id: doc?._id, // Example transformation
                    name: doc.title, // Another example
                }))
            );



        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    const getPatients = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getPatients(params);



            setPatients(
                data?.data?.patients?.map((doc) => ({
                    ...doc,
                    id: doc?._id, // Example transformation
                    name: doc.title + " " + doc?.first_name + ' ' + doc?.last_name, // Another example
                }))
            );

        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    const getForms = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getConsentForms(params);



            setForms(
                data?.data?.forms?.map((doc) => ({
                    ...doc,
                    id: doc?._id, // Example transformation
                    name: doc?.first_name + ' ' + doc?.last_name, // Another example
                }))
            );

        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    useEffect(() => {
        getForms()
        getPatients()
        getDocuments()
    }, [])
    useEffect(() => {
        // Disable drawing on the single canvas
        if (sigCanvas.current) {
            sigCanvas.current.off();
        }

        // Disable drawing on all multiple canvases
        signCanvasRefs.current.forEach((canvas) => {
            if (canvas) {
                canvas.off();
            }
        });
    }, []);

    return (
        <div>

            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none', backgroundColor: '#ffff', borderRadius: '12px' }}>



                <Box component={'form'} p={3} sx={{ borderRadius: '12px' }} onSubmit={handleSubmit(CreateConsentForm)} >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Medical History Form
                    </Typography>

                    <Grid container mt={4} spacing={2}>


                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
                            <InputLabel sx={{
                                textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>

                                Select Form :
                            </InputLabel>
                            <SelectField
                                size={'small'}
                                newLabel={'Select Form'}
                                fullWidth={true}
                                options={forms}
                                selected={selectedForm}
                                onSelect={(value) => {
                                    setSelectedForm(value)


                                }}
                                error={errors?.form?.message}
                                register={register("form", {
                                    required: false,
                                })}
                            />

                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
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
                                                Treatment Date :*
                                            </InputLabel>
                                            <Controller
                                                name="treatmentDate"
                                                control={control}
                                                rules={{ required: "Please select a date" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        value={field.value || null}
                                                        onChange={(newValue) => field.onChange(newValue)}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                fullWidth: true,
                                                                sx: {
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: '12px',
                                                                        "& fieldset": { border: "1 solid #e0e0e0" }, // Default border
                                                                        "&:hover fieldset": { border: "1 solid #0076bf" }, // On hover
                                                                        "&.Mui-focused fieldset": { border: "1 solid #0076bf !important" } // On focus
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.treatmentDate && (
                                                <Typography color="error">{errors.treatmentDate.message}</Typography>
                                            )}
                                        </Box>
                                    </Grid>




                                </Grid>


                            </LocalizationProvider>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
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
                                                Consultation Date :*
                                            </InputLabel>
                                            <Controller
                                                name="consultationDate"
                                                control={control}
                                                rules={{ required: "Please select a date" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        value={field.value || null}
                                                        onChange={(newValue) => field.onChange(newValue)}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                fullWidth: true,
                                                                sx: {
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: '12px',
                                                                        "& fieldset": { border: "1 solid #e0e0e0" }, // Default border
                                                                        "&:hover fieldset": { border: "1 solid #0076bf" }, // On hover
                                                                        "&.Mui-focused fieldset": { border: "1 solid #0076bf !important" } // On focus
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.consultationDate && (
                                                <Typography color="error">{errors.consultationDate.message}</Typography>
                                            )}
                                        </Box>
                                    </Grid>




                                </Grid>


                            </LocalizationProvider>
                        </Grid>
                        <Grid container p={2} spacing={2} >

                            <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
                                <InputLabel sx={{
                                    textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "4px",
                                }}>

                                    Existing or New Patient :
                                </InputLabel>
                                <FormControl component="fieldset">

                                    <RadioGroup row value={patientType} onChange={handleChange}>
                                        <FormControlLabel value="existing" control={<Radio />} label="Existing" />
                                        <FormControlLabel value="new" control={<Radio />} label="New" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
                                {patientType == 'existing' && <> <InputLabel sx={{
                                    textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "4px",
                                }}>

                                    Select Patient :
                                </InputLabel>
                                    <SelectField
                                        size={'small'}
                                        newLabel={'Select Patient'}
                                        fullWidth={true}
                                        options={patients}
                                        selected={selectedPatient}
                                        onSelect={(value) => {
                                            setSelectedPatient(value);
                                            console.log("Selected Patient:", value);

                                            setValue('fname', value?.first_name || "");
                                            setValue('lname', value?.last_name || "");
                                            setValue('email', value?.email || "");
                                            setValue('post', value?.post_code || "");
                                            setValue('phone', value?.phone || "");
                                            setValue('address', value?.address || "");
                                            setValue('notes', value?.notes || "");
                                            setValue('name', value?.kin_details?.name || "");
                                            setValue('kinemail', value?.kin_details?.email || "");
                                            setValue('kinphone', value?.kin_details?.phone || "");
                                            setValue('kinaddress', value?.kin_details?.address || "");
                                            setValue('genname', value?.general_practitioner?.name || "");
                                            setValue('genemail', value?.general_practitioner?.email || "");
                                            setValue('genphone', value?.general_practitioner?.phone || "");
                                            setValue('genaddress', value?.general_practitioner?.address || "");
                                            console.log("Raw DOB:", value?.dob);

                                            if (value?.dob) {
                                                // Convert to Dayjs format
                                                const parsedDate = dayjs(value.dob);

                                                // Check if the conversion is valid
                                                if (!parsedDate.isValid()) {
                                                    console.error("Invalid DOB Format:", value.dob);
                                                    return;
                                                }

                                                console.log("Parsed Date:", parsedDate);
                                                setValue("selectedDate", parsedDate);
                                            }
                                        }}
                                        error={errors?.patient?.message}
                                        register={register("patient", {
                                            required: false,
                                        })}
                                    />
                                </>}
                            </Grid>
                            <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
                                {patientType == 'existing' && <><InputLabel sx={{
                                    textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "4px",
                                }}>

                                    Select Aftercare Document :
                                </InputLabel>
                                    <SelectField
                                        size={'small'}
                                        newLabel={'Select Document'}
                                        fullWidth={true}
                                        options={documents}
                                        selected={selectedDocument}
                                        onSelect={(value) => {
                                            setSelectedDocument(value)


                                        }}
                                        error={errors?.document?.message}
                                        register={register("document", {
                                            required: false,
                                        })}
                                    /> </>}
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Patient First Name :*"}
                            size={'small'}
                            placeholder={"Patient First Name"}
                            error={errors?.fname?.message}
                            register={register("fname", {
                                required:
                                    "Please enter your fname."

                            })}
                        /></Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Patient Last Name :*"}
                            size={'small'}
                            placeholder={" Patient Last Name"}
                            error={errors?.lname?.message}
                            register={register("lname", {
                                required:
                                    "Please enter your lname."

                            })}
                        /></Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Patient Email :*"}
                            size={'small'}
                            placeholder={"Patient Email"}
                            error={errors?.email?.message}
                            register={register("email", {
                                required:
                                    "Please enter your email."

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
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
                                                        onChange={(newValue) => field.onChange(newValue)}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                fullWidth: true,
                                                                sx: {
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: '12px',
                                                                        "& fieldset": { border: "1 solid #e0e0e0" }, // Default border
                                                                        "&:hover fieldset": { border: "1 solid #0076bf" }, // On hover
                                                                        "&.Mui-focused fieldset": { border: "1 solid #0076bf !important" } // On focus
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
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Phone Number :*"}
                            size={'small'}
                            placeholder={"Phone Number"}
                            error={errors?.phone?.message}
                            register={register("phone", {
                                required:
                                    "Please enter your phone."

                            })}
                        /></Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Post Code :*"}
                            size={'small'}
                            placeholder={"Post Code"}
                            error={errors?.post?.message}
                            register={register("post", {
                                required:
                                    "Please enter your postcode."

                            })}
                        /></Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Address :*"}
                            size={'small'}
                            placeholder={"Address"}
                            error={errors?.address?.message}
                            register={register("address", {
                                required:
                                    "Please enter your address."

                            })}
                        /></Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
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


                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Name :"}
                            size={'small'}
                            placeholder={"Name"}
                            error={errors?.name?.message}
                            register={register("name", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Email :"}
                            size={'small'}
                            placeholder={"Email"}
                            error={errors?.kinemail?.message}
                            register={register("kinemail", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Phone Number :"}
                            size={'small'}
                            placeholder={"Phone Number"}
                            error={errors?.kinphone?.message}
                            register={register("kinphone", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
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


                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Name :"}
                            size={'small'}
                            placeholder={"Name"}
                            error={errors?.genname?.message}
                            register={register("genname", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Email :"}
                            size={'small'}
                            placeholder={"Email"}
                            error={errors?.genemail?.message}
                            register={register("genemail", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Phone Number :"}
                            size={'small'}
                            placeholder={"Phone Number"}
                            error={errors?.genphone?.message}
                            register={register("genphone", {
                                required:
                                    false

                            })}
                        /></Grid>

                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}><InputField
                            label={"Address :"}
                            size={'small'}
                            placeholder={"Address"}
                            error={errors?.genaddress?.message}
                            register={register("genaddress", {
                                required:
                                    false

                            })}
                        /></Grid>
                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Grid container spacing={2} p={2}>
                            {/* Marketing Permission */}
                            <Grid item lg={6} md={12} sm={12} mt={2}>
                                <FormLabel component="legend" sx={{ color: 'black' }}>Can we have permission to use your images for marketing?</FormLabel>
                                <FormControl component="fieldset">

                                    <RadioGroup row name="marketing" value={permissions.marketing} onChange={handleChange2}>
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {/* Offers & Reminders Permission */}
                            <Grid item lg={6} md={12} sm={12} mt={2}>
                                <FormLabel component="legend" sx={{ color: 'black' }}>Can we send you offers & reminders by text email & WhatsApp?</FormLabel>
                                <FormControl component="fieldset">

                                    <RadioGroup row name="offers" value={permissions.offers} onChange={handleChange2}>
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                        <FormControlLabel value="no" control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Typography variant="h5" fontWeight="bold" mb={2} p={2}>
                            Facial Mapping
                        </Typography>
                        <Grid container spacing={2} p={2}>
                            <Grid item lg={6} >
                                <Typography>Facial Marking:</Typography>
                                <div style={{ position: "relative", width: 300, height: 150 }}>
                                    <SignatureCanvas
                                        ref={sigMarkingRef}
                                        penColor="red"
                                        canvasProps={{
                                            width: 300,
                                            height: 150,
                                            className: "sigCanvas",
                                            style: { border: "1px dashed black", background: `url(${Images.girl}) center/cover no-repeat` },
                                        }}
                                    />
                                </div>
                                <Grid container spacing={1} mt={1}>
                                    <Grid item>
                                        <Button variant="contained" color="secondary" onClick={handleClearMarking} sx={{ textTransform: 'capitalize' }}>
                                            Clear Marking
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={handleSaveMarking} sx={{ textTransform: 'capitalize' }}>
                                            Save Marking
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {markingLoader ? <Grid item display={'flex'} justifyContent={'flex-start'} alignItems={'center'} xs={6}>
                                <CircularProgress size={50} />
                            </Grid> : (
                                <Grid item lg={6}>
                                    <Typography>Saved Image:</Typography>
                                    <img src={savedImage ? import.meta.env.VITE_BASE_URL + savedImage : Images.girl} alt="Marked Face" style={{ width: 300, height: 150, border: "1px solid black" }} />
                                </Grid>
                            )}

                        </Grid>
                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Typography variant="h5" fontWeight="bold" mb={2} p={2}>
                            Treatment plan section
                        </Typography>

                        <Grid container spacing={2} p={2}>
                            {/* Patient Concerns */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Patient concerns"
                                    size="small"
                                    placeholder="Patient concerns"
                                    error={errors?.patientConcerns?.message}
                                    register={register("patientConcerns", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            {/* Patient Goal */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Patient goal"
                                    size="small"
                                    placeholder="Patient goal"
                                    error={errors?.patientGoal?.message}
                                    register={register("patientGoal", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            {/* Advised Plan/Product */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Advised Plan/product"
                                    size="small"
                                    placeholder="Advised Plan/product"
                                    error={errors?.advisedPlan?.message}
                                    register={register("advisedPlan", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            {/* Expected Result */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Expected Result"
                                    size="small"
                                    placeholder="Expected Result"
                                    error={errors?.expectedResult?.message}
                                    register={register("expectedResult", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="p" fontWeight={500} mb={2} p={2}>
                            I confirm my medical history to be true and correct. I agree I have read and understood all the contents of this document. I have read and understood all the content of this document and agree with the treatment plan. I give my consent to treatment and understand the possible complications and side effects. I confirm I have received an aftercare sheet
                        </Typography>
                        <Grid container spacing={5} p={2} alignItems="center">
                            {/* Date Field */}
                            <Grid item lg={6} md={6} sm={12} mt={2}>
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
                                                    Patient Date :*
                                                </InputLabel>
                                                <Controller
                                                    name="patientDate"
                                                    control={control}
                                                    rules={{ required: "Please select a date" }}
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            {...field}
                                                            value={field.value || null}
                                                            onChange={(newValue) => field.onChange(newValue)}
                                                            slotProps={{
                                                                textField: {
                                                                    size: "small",
                                                                    fullWidth: true,
                                                                    sx: {
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: '12px',
                                                                            "& fieldset": { border: "1 solid #e0e0e0" }, // Default border
                                                                            "&:hover fieldset": { border: "1 solid #0076bf" }, // On hover
                                                                            "&.Mui-focused fieldset": { border: "1 solid #0076bf !important" } // On focus
                                                                        },
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.patientDate && (
                                                    <Typography color="error">{errors.patientDate.message}</Typography>
                                                )}
                                            </Box>
                                        </Grid>




                                    </Grid>


                                </LocalizationProvider>
                            </Grid>

                            {/* Signature Canvas */}
                            <Grid item xs={6} mt={2}>
                                <Typography>Patient Signature:</Typography>
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor="black"
                                    canvasProps={{
                                        width: 300,
                                        height: 150,
                                        className: "sigCanvas",
                                        style: { border: "1px dashed black" },
                                    }}
                                />
                                {/* <Grid container spacing={1} mt={1}>
                                    <Grid item>
                                        <Button variant="contained" color="secondary" onClick={handleClear} sx={{ textTransform: 'capitalize' }}>
                                            Clear Signature
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={handleSave} sx={{ textTransform: 'capitalize' }}>
                                            Save Signature
                                        </Button>
                                    </Grid>

                                </Grid> */}


                            </Grid>
                        </Grid>
                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        {console.log(watch('records'))
                        }
                        <Typography variant="h5" p={2} fontWeight={'bold'}>Treatment Record Section</Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {fields.map((item, index) => (
                                <Grid container spacing={2} p={2} alignItems="center" key={item.id} mt={2}>

                                    {/* Patient Date Selection */}
                                    <Grid item lg={3} md={4} sm={6} xs={6}>
                                        <Box>
                                            <InputLabel
                                                sx={{
                                                    textTransform: "capitalize",
                                                    textAlign: "left",
                                                    fontWeight: 700,
                                                    fontSize: "14px",
                                                    color: "#333",
                                                    marginBottom: 1.5,
                                                }}
                                            >
                                                Date :*
                                            </InputLabel>

                                            <Controller
                                                name={`records.${index}.date`}
                                                control={control}
                                                rules={{ required: "Please select a date" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        value={field.value || null}
                                                        onChange={(newValue) => field.onChange(newValue)}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                fullWidth: true,
                                                                sx: {
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "12px",
                                                                        "& fieldset": { border: "1px solid #e0e0e0" },
                                                                        "&:hover fieldset": { border: "1px solid #0076bf" },
                                                                        "&.Mui-focused fieldset": { border: "1px solid #0076bf !important" },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.records?.[index]?.date && (
                                                <Typography color="error">
                                                    {errors.records[index].date.message}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>

                                    {/* Amount Field */}
                                    <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
                                        <InputField
                                            label="Amount"
                                            placeholder="Order Amount"
                                            size="small"
                                            register={register(`records.${index}.amount`)}
                                        />
                                    </Grid>



                                    {/* Description Field */}
                                    <Grid item lg={4} md={4} sm={11}>
                                        <InputField
                                            label="Description"
                                            multiline
                                            rows={3}
                                            placeholder="Description"
                                            register={register(`records.${index}.description`)}
                                        />
                                    </Grid>
                                    {/* Remove Button (only for additional fields) */}
                                    <Grid item xs={1}>
                                        {index > 0 && (
                                            <IconButton color="error" onClick={() => remove(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                        </LocalizationProvider>



                        <Grid container p={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => append({ date: "", amount: "", description: "" })}
                                sx={{ mt: 2, textTransform: 'capitalize' }}
                            >
                                Add More
                            </Button>
                        </Grid>
                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Grid item lg={5} sm={12}>
                            <InputLabel sx={{
                                textTransform: "capitalize", mt: 2,
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>
                                Upload Batch Images :*
                            </InputLabel>

                            <Controller
                                name="media"
                                control={control}
                                rules={{
                                    required: "At least one image file is required",
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return "At least one image file is required";
                                        }
                                        for (let i = 0; i < value.length; i++) {
                                            if (value[i].size > 10 * 1024 * 1024) {
                                                return "Each file must be smaller than 10MB";
                                            }
                                            if (!value[i].type.startsWith("image/")) {
                                                return "Only image files are allowed";
                                            }
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange } }) => (
                                    <>
                                        {/* Hidden Inputs */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            style={{ display: "none" }}
                                            id="upload-media-camera"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                onChange(files);
                                                handleFileChange2(e);
                                            }}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            id="upload-media-gallery"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                onChange(files);
                                                handleFileChange2(e);
                                            }}
                                        />

                                        {/* UI */}
                                        <Box sx={{
                                            borderRadius: "8px",
                                            padding: "20px",
                                            textAlign: "center",
                                            backgroundColor: "#f9f9f9",
                                            height: '135px',
                                        }}>
                                            {!imageLoader ? (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ m: 1 }}
                                                        onClick={() => document.getElementById("upload-media-camera").click()}
                                                    >
                                                        📸 Take Photo
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ m: 1 }}
                                                        onClick={() => document.getElementById("upload-media-gallery").click()}
                                                    >
                                                        🖼️ Choose from Gallery
                                                    </Button>
                                                    <Typography variant="caption" sx={{ color: "#666", mt: 1, display: 'block' }}>
                                                        Allowed: Images (Max 10MB per file)
                                                    </Typography>
                                                </>
                                            ) : (
                                                <CircularProgress size={90} />
                                            )}
                                        </Box>

                                        {errors.media && (
                                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                                {errors.media.message}
                                            </Typography>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>

                        <Grid container p={2}>
                            {uploadedImages?.length > 0 && (
                                <Grid item xs={12}>
                                    <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 3, mt: 3 }}>
                                        Uploaded Batch Images :
                                    </InputLabel>
                                </Grid>
                            )}
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                {uploadedImages?.length > 0 &&
                                    uploadedImages.map((file, index) => (
                                        <Box key={index} sx={{ position: "relative", textAlign: "center" }}>
                                            <img
                                                src={import.meta.env.VITE_BASE_URL + file}
                                                alt="Uploaded Preview"
                                                style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    mt: 1,
                                                    maxWidth: "150px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {file.split("/").pop()}
                                            </Typography>
                                            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                                                <IconButton
                                                    onClick={() => handleRemoveImage(index)}
                                                    sx={{
                                                        backgroundColor: "rgba(0,0,0,0.6)",
                                                        color: "#fff",
                                                        "&:hover": { backgroundColor: "red" },
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        p: 0.5,
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        </Grid>

                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>

                        <Grid item lg={5} sm={12}>
                            <InputLabel sx={{
                                textTransform: "capitalize", mt: 2,
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>
                                Upload Before Images :*
                            </InputLabel>

                            <Controller
                                name="media2"
                                control={control}
                                rules={{
                                    required: "At least one image file is required",
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return "At least one image file is required";
                                        }
                                        for (let i = 0; i < value.length; i++) {
                                            if (value[i].size > 10 * 1024 * 1024) {
                                                return "Each file must be smaller than 10MB";
                                            }
                                            if (!value[i].type.startsWith("image/")) {
                                                return "Only image files are allowed";
                                            }
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange } }) => (
                                    <>
                                        {/* Hidden Inputs */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            style={{ display: "none" }}
                                            id="upload-media2-camera"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                onChange(files);
                                                handleFileChange3(e);
                                            }}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            id="upload-media2-gallery"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                onChange(files);
                                                handleFileChange3(e);
                                            }}
                                        />

                                        {/* UI */}
                                        <Box sx={{
                                            borderRadius: "8px",
                                            padding: "20px",
                                            textAlign: "center",
                                            backgroundColor: "#f9f9f9",
                                            height: '135px',
                                        }}>
                                            {!imageLoaderBefore ? (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ m: 1 }}
                                                        onClick={() => document.getElementById("upload-media2-camera").click()}
                                                    >
                                                        📸 Take Photo
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ m: 1 }}
                                                        onClick={() => document.getElementById("upload-media2-gallery").click()}
                                                    >
                                                        🖼️ Choose from Gallery
                                                    </Button>
                                                    <Typography variant="caption" sx={{ color: "#666", mt: 1, display: 'block' }}>
                                                        Allowed: Images (Max 10MB per file)
                                                    </Typography>
                                                </>
                                            ) : (
                                                <CircularProgress size={90} />
                                            )}
                                        </Box>

                                        {errors.media2 && (
                                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                                {errors.media2.message}
                                            </Typography>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>

                        <Grid container p={2}>
                            {beforeImages?.length > 0 && (
                                <Grid item xs={12}>
                                    <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 3, mt: 3 }}>
                                        Uploaded Before Images :
                                    </InputLabel>
                                </Grid>
                            )}
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                {beforeImages?.length > 0 &&
                                    beforeImages.map((file, index) => (
                                        <Box key={index} sx={{ position: "relative", textAlign: "center" }}>
                                            <img
                                                src={import.meta.env.VITE_BASE_URL + file}
                                                alt="Uploaded Preview"
                                                style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    mt: 1,
                                                    maxWidth: "150px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {file.split("/").pop()}
                                            </Typography>
                                            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                                                <IconButton
                                                    onClick={() => handleRemoveImage2(index)}
                                                    sx={{
                                                        backgroundColor: "rgba(0,0,0,0.6)",
                                                        color: "#fff",
                                                        "&:hover": { backgroundColor: "red" },
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        p: 0.5,
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        </Grid>

                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>

                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Grid item lg={5} sm={12}>
                            <InputLabel sx={{
                                textTransform: "capitalize", mt: 2,
                                textAlign: "left",
                                fontWeight: 600,
                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>
                                Upload After Images :*
                            </InputLabel>

                            <Controller
                                name="media3"
                                control={control}
                                rules={{
                                    required: "At least one image file is required",
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return "At least one image file is required";
                                        }
                                        for (let i = 0; i < value.length; i++) {
                                            if (value[i].size > 10 * 1024 * 1024) {
                                                return "Each file must be smaller than 10MB";
                                            }
                                            if (!value[i].type.startsWith("image/")) {
                                                return "Only image files are allowed";
                                            }
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange } }) => (
                                    <>
                                        {/* Hidden Inputs */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            multiple
                                            style={{ display: "none" }}
                                            id="upload-media3-camera"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                onChange(files);
                                                handleFileChange4(e);
                                            }}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: "none" }}
                                            id="upload-media3-gallery"
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                onChange(files);
                                                handleFileChange4(e);
                                            }}
                                        />

                                        {/* UI */}
                                        <Box sx={{
                                            borderRadius: "8px",
                                            padding: "20px",
                                            textAlign: "center",
                                            backgroundColor: "#f9f9f9",
                                            height: '135px',
                                        }}>
                                            {!imageLoaderAfter ? (
                                                <>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ m: 1 }}
                                                        onClick={() => document.getElementById("upload-media3-camera").click()}
                                                    >
                                                        📸 Take Photo
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ m: 1 }}
                                                        onClick={() => document.getElementById("upload-media3-gallery").click()}
                                                    >
                                                        🖼️ Choose from Gallery
                                                    </Button>
                                                    <Typography variant="caption" sx={{ color: "#666", mt: 1, display: 'block' }}>
                                                        Allowed: Images (Max 10MB per file)
                                                    </Typography>
                                                </>
                                            ) : (
                                                <CircularProgress size={90} />
                                            )}
                                        </Box>

                                        {errors.media3 && (
                                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                                {errors.media3.message}
                                            </Typography>
                                        )}
                                    </>
                                )}
                            />
                        </Grid>

                        <Grid container p={2}>
                            {afterImages?.length > 0 && (
                                <Grid item xs={12}>
                                    <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 3, mt: 3 }}>
                                        Uploaded After Images :
                                    </InputLabel>
                                </Grid>
                            )}
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                {afterImages?.length > 0 &&
                                    afterImages.map((file, index) => (
                                        <Box key={index} sx={{ position: "relative", textAlign: "center" }}>
                                            <img
                                                src={import.meta.env.VITE_BASE_URL + file}
                                                alt="Uploaded Preview"
                                                style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    mt: 1,
                                                    maxWidth: "150px",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {file.split("/").pop()}
                                            </Typography>
                                            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                                                <IconButton
                                                    onClick={() => handleRemoveImage3(index)}
                                                    sx={{
                                                        backgroundColor: "rgba(0,0,0,0.6)",
                                                        color: "#fff",
                                                        "&:hover": { backgroundColor: "red" },
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        p: 0.5,
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    ))}
                            </Box>
                        </Grid>

                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Typography variant="h6" p={2} sx={{ mt: 4, fontWeight: 'bold' }}>Further Records</Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {furtherFields.map((item, index) => (
                                <Grid container spacing={2} p={2} alignItems="center" key={item.id} mt={2}>
                                    {/* Date Selection */}
                                    <Grid item lg={5} md={12}>
                                        <Box>
                                            <InputLabel sx={{ fontWeight: 700, fontSize: "14px", marginBottom: 1.5 }}>
                                                Further Date :*
                                            </InputLabel>
                                            <Controller
                                                name={`furtherFields.${index}.date`}
                                                control={control}
                                                rules={{ required: "Please select a date" }}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        {...field}
                                                        value={field.value || null}
                                                        onChange={(newValue) => field.onChange(newValue)}
                                                        slotProps={{
                                                            textField: {
                                                                size: "small",
                                                                fullWidth: true,
                                                                sx: {
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "12px",
                                                                        "& fieldset": { border: "1px solid #e0e0e0" },
                                                                        "&:hover fieldset": { border: "1px solid #0076bf" },
                                                                        "&.Mui-focused fieldset": { border: "1px solid #0076bf !important" },
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.furtherFields?.[index]?.date && (
                                                <Typography color="error">
                                                    {errors.furtherFields[index].date.message}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Typography mt={2}>
                                            I confirm there has not been any changes to my medical history or my health since completing this form , it is still true and up to date.
                                        </Typography>
                                    </Grid>

                                    {/* Signature Field */}
                                    <Grid item xs={5}>
                                        <Box>
                                            <InputLabel sx={{ fontWeight: 700, fontSize: "14px", marginBottom: 1 }}>
                                                Signature :*
                                            </InputLabel>
                                            <SignatureCanvas
                                                ref={(el) => (signCanvasRefs.current[index] = el)}
                                                penColor="black"
                                                canvasProps={{ width: 300, height: 150, style: { border: "1px dashed black" } }}
                                            />

                                        </Box>
                                        {/* <Grid container spacing={1} mt={1}>
                                            <Grid item>
                                                <Button variant="contained" color="secondary" onClick={() => clearSignature(index)} sx={{ textTransform: 'capitalize' }}>
                                                    Clear Signature
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary" onClick={() => updateSignature(index)} sx={{ textTransform: 'capitalize' }}>
                                                    Save Signature
                                                </Button>
                                            </Grid>

                                        </Grid> */}
                                    </Grid>

                                    {/* Remove Button */}
                                    <Grid item xs={1} display="flex" justifyContent="flex-end">
                                        {furtherFields.length > 1 && (
                                            <IconButton color="error" onClick={() => removeFurther(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </Grid>
                            ))}
                        </LocalizationProvider>

                        <Grid p={2}>
                            <Button variant="contained" color="secondary" onClick={() => appendFurther({ date: null, sign: "" })} sx={{ mt: 2, textTransform: 'capitalize' }}>
                                Add More Further Records
                            </Button>
                        </Grid>
                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} mt={2}><InputField
                            label={"Notes :"}
                            multiline
                            rows={3}
                            size={'small'}
                            placeholder={"Notes"}
                            error={errors?.extranotes?.message}
                            register={register("extranotes", {
                                required:
                                    false

                            })}
                        /></Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader} type={'submit'} title={"Create"} />
                    </Box>
                </Box>
            </Paper>
        </div >
    )
}

export default CreateConsentForm
