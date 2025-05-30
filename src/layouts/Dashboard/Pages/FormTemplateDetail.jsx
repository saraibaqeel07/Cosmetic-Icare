import { useEffect, useRef, useState } from "react";
import ApiServices from "../../../services/Apis";
import { PrimaryButton } from "../../../components/buttons";
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputAdornment, InputLabel, Paper, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import InputField from "../../../components/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import SignatureCanvas from "react-signature-canvas";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from "dayjs";
import { Images } from "../../../assets/images";

const FormTemplateDetail = () => {
    const navigate = useNavigate()
    const [markingLoader, setMarkingLoader] = useState(false)
    const [userData, setUserData] = useState(null)
    const { register, control, handleSubmit, setValue, getValues, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            records: [{ question: "" }], // Initial field (cannot be removed)
            furtherFields: [{ date: null, sign: "" }], // Additional dynamic section
        },
    });

    const { id } = useParams()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "records",
    });

    const sigMarkingRef = useRef(null);
    const [savedImage, setSavedImage] = useState(null);

    const backgroundImage = Images.girl; // Replace with actual image URL

    // useEffect(() => {
    //     const canvas = sigMarkingRef.current.getCanvas();
    //     const ctx = canvas.getContext("2d");
    //     const img = new Image();
    //     img.src = backgroundImage;
    //     img.onload = () => {
    //         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //     };
    // }, []);

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
    const UpdateFormTemplate = async (fromData) => {
        setLoader(true);
        console.log(fromData);

        try {
            let obj = {
                _id: id,
                name: getValues('fromName'),
                category: selectedForm?.id,
                side_effect_text: getValues('sideEffectText'),
                patient_consent_text: getValues('patientConsentText'),
                disclaimer_text: getValues('disclaimerText'),
                medications_section: getValues('medication'),
                allergic: getValues('allergic'),
                questionnaire: fromData?.records,
            };

            console.log(obj);

            const promise = ApiServices.UpdateFormTemplate(obj);

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
                navigate('/form-templates')


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
    const getData = async () => {
        try {
            let params = {
                id: id,

            };

            const data = await ApiServices.getFormTemplateDetail(params);
            let form = data?.data?.template


            setValue('fromName', form?.name)
            setSelectedForm({ id: form?.category, name: form?.category })
            setValue('sideEffectText', form?.side_effect_text)
            setValue('patientConsentText', form?.patient_consent_text)
            setValue('disclaimerText', form?.disclaimer_text)
            setValue('allergic', form?.allergies_section)
            setValue('medication', form?.medications_section)

            setValue("records", form?.questionnaire);


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    useEffect(() => {
        getForms()
        getData()
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



                <Box component={'form'} p={3} sx={{ borderRadius: '12px' }} onSubmit={handleSubmit(UpdateFormTemplate)} >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Consent Form Template Detail
                    </Typography>

                    <Grid container mt={4} spacing={2}>

                        <Grid item lg={3} md={3} sm={11} mt={2}>
                            <InputField
                                label="Form Name"
                                size="small"
                                disabled={true}
                                placeholder="Form Name"
                                error={errors?.fromName?.message}
                                register={register("fromName", {
                                    required: 'required',
                                })}
                            />
                        </Grid>
                        <Grid item lg={3} md={4} sm={6} xs={6} mt={2}>
                            <InputLabel sx={{
                                textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                fontSize: "14px",
                                color: "#333",
                                marginBottom: "4px",
                            }}>

                                Select Category :
                            </InputLabel>
                            <SelectField
                                size={'small'}
                                disabled={true}
                                newLabel={'Select Category'}
                                fullWidth={true}
                                options={[{ id: 'Beauty', name: 'Beauty' }, { id: 'Aesthetic', name: 'Aesthetic' }]}
                                selected={selectedForm}
                                onSelect={(value) => {
                                    setSelectedForm(value)


                                }}
                                error={errors?.category?.message}
                                register={register("category", {
                                    required: false,
                                })}
                            />

                        </Grid>





                    </Grid>



                    <Grid container mt={4} spacing={2}>






                        <Grid container spacing={2} p={2}>
                            {/* SideEffect Text */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="SideEffect Text"
                                    size="small"
                                    disabled={true}
                                    placeholder="SideEffect Text"
                                    error={errors?.sideEffectText?.message}
                                    register={register("sideEffectText", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            {/* Patient Consent Text */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Patient Consent Text"
                                    size="small"
                                    disabled={true}
                                    placeholder="Patient Consent Text"
                                    error={errors?.patientConsentText?.message}
                                    register={register("patientConsentText", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            {/* Disclaimer Text */}
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Disclaimer Text"
                                    size="small"
                                    disabled={true}
                                    placeholder="Disclaimer Text"
                                    error={errors?.disclaimerText?.message}
                                    register={register("disclaimerText", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                {fields.map((item, index) => (
                                    <Grid container spacing={2} p={2} alignItems="center" key={item.id} mt={2}>







                                        {/* Description Field */}
                                        <Grid item lg={12} md={12} sm={11}>
                                            <InputField
                                                label="Questions"
                                                disabled={true}
                                                multiline
                                                rows={3}
                                                placeholder="Questions"
                                                register={register(`records.${index}.question`)}
                                            />
                                        </Grid>
                                        {/* Remove Button (only for additional fields) */}
                                        {/* <Grid item xs={1}>
                                            {index > 0 && (
                                                <IconButton color="error" onClick={() => remove(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Grid> */}
                                    </Grid>
                                ))}
                            </LocalizationProvider>



                            {/* <Grid container p={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => append({ question: "" })}
                                    sx={{ mt: 2, textTransform: 'capitalize' }}
                                >
                                    Add Questions
                                </Button>
                            </Grid> */}

                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Medication Section"
                                    size="small"
                                    disabled={true}
                                    placeholder="are you taking any medications?"
                                    error={errors?.medication?.message}
                                    register={register("medication", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={6} mt={2}>
                                <InputField
                                    label="Allergies Section"
                                    size="small"
                                    disabled={true}
                                    placeholder="are you allergic to any medications?"
                                    error={errors?.allergic?.message}
                                    register={register("allergic", { required: false })}
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>







                        <Grid container p={1}>
                            <Divider sx={{ mt: 4, width: '100%' }} />
                        </Grid>






                    </Grid>
                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader} type={'submit'} title={"Update"} />
                    </Box> */}
                </Box>
            </Paper>
        </div >
    )
}

export default FormTemplateDetail
