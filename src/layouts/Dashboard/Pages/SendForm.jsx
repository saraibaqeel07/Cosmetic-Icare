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
import { id } from "date-fns/locale";


const SendForm = () => {
    const { id } = useParams()
    const navigate = useNavigate()
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
    const [formData, setFormData] = useState(null)
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
    const SendForm = async (formData) => {
        console.log(formData);

        setLoader(true);
        try {
            let obj = {
                _id: id,
               
                aftercare_document: patientType == 'existing' ? selectedDocument?._id : null,
                first_name:getValues('fname'),
                last_name:getValues('lname'),
                email:getValues('email')
               


            };
            console.log(obj);

            const promise = ApiServices.SendForm(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);

            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );

           
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
    console.log(watch());

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
                    "https://cosmetic.theappkit.com/api/system/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    const fullImageUrl = "https://cosmetic.theappkit.com" + imagePath;
                    uploadedNewBatchImages.push(fullImageUrl);
                    console.log("Uploaded Image URL:", fullImageUrl);
                }
            }

            setUploadedImages(uploadedNewBatchImages); // Update state with uploaded image URLs
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
                    "https://cosmetic.theappkit.com/api/system/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    const fullImageUrl = "https://cosmetic.theappkit.com" + imagePath;
                    uploadedNewBeforeImages.push(fullImageUrl);
                    console.log("Uploaded Image URL:", fullImageUrl);
                }
            }

            setBeforeImages(uploadedNewBeforeImages); // Update state with uploaded image URLs
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
                    "https://cosmetic.theappkit.com/api/system/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    const fullImageUrl = "https://cosmetic.theappkit.com" + imagePath;
                    uploadedNewAfterImages.push(fullImageUrl);
                    console.log("Uploaded Image URL:", fullImageUrl);
                }
            }

            setAfterImages(uploadedNewAfterImages); // Update state with uploaded image URLs
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
    useEffect(() => {
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
    const getData = async () => {
        try {
            let params = {
                id: id,

            };

            const data = await ApiServices.getFormDetail(params);
            let form = data?.data?.form
            setValue('treatmentDate', dayjs(form?.treatment_date))
            setValue('consultationDate', dayjs(form?.consultation_date))
            setPermissions({
                marketing: form?.permission_marketing ? 'yes' : 'no',
                offers: form?.offers ? 'yes' : 'no',
            })
            setFormData(form)
            setValue("media", { shouldValidate: true });
            setValue("media2", { shouldValidate: true });
            setValue("media3", { shouldValidate: true });
            setSignature(form?.treatment_plan?.patient_sign)
            setValue('patientDate', dayjs(form?.treatment_plan?.date))
            setValue('patientConcerns', form?.treatment_plan?.patient_concerns)
            setValue('patientGoal', form?.treatment_plan?.patient_goals)
            setValue('advisedPlan', form?.treatment_plan?.advised_plan)
            setValue('expectedResult', form?.treatment_plan?.expected_result)
            let recordData = form?.treatment_record?.map((doc) => ({
                ...doc,

                date: dayjs(doc?.date)
            }))
            let furtherData = form?.further_treatment?.map((doc) => ({
                ...doc,

                date: dayjs(doc?.date)
            }))
            setValue("records", recordData);
            setValue("furtherFields", furtherData);
            setValue("extranotes", form?.extra_notes);
            setUploadedImages(form?.batch_images)
            setBeforeImages(form?.before_images)
            setAfterImages(form?.after_images)

        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    console.log(permissions);

    useEffect(() => {
        getData()
    }, [])
    useEffect(() => {
        let value = patients?.find(item => item?._id == formData?.patient_id)
        setSelectedPatient(patients?.find(item => item?._id == formData?.patient_id))
        setSelectedDocument(documents?.find(item => item?._id == formData?.aftercare_document))

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

    }, [patients, documents])


    return (
        <div>

            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none', backgroundColor: '#eff6ff', borderRadius: '12px' }}>



                <Box component={'form'} p={3} sx={{ borderRadius: '12px' }} onSubmit={handleSubmit(SendForm)} >
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Medical History Form
                    </Typography>

                    <Grid container mt={4} spacing={2}>


                       
                       
                        <Grid container p={2} spacing={2} >
                        <Grid item xs={3} mt={2}>
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
                                disabled={true}
                                fullWidth={true}
                                options={[]}
                                selected={title}
                                onSelect={(value) => {
                                    setTitle(value)


                                }}
                                error={errors?.title?.message}
                                register={register("title", {
                                    required: false,
                                })}
                            />

                        </Grid>
                            <Grid item xs={3} mt={2}>
                                <InputLabel sx={{
                                    textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "4px",
                                }}>

                                    Existing or New Patient :
                                </InputLabel>
                                <FormControl component="fieldset">

                                    <RadioGroup row value={patientType}  >
                                        <FormControlLabel value="existing" control={<Radio />} label="Existing" />
                                        <FormControlLabel value="new" control={<Radio />} label="New" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3} mt={2}>
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
                                        disabled={true}
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
                            <Grid item xs={3} mt={2}>
                                {patientType == 'existing' && <><InputLabel sx={{
                                    textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block',

                                    fontSize: "14px",
                                    color: "#333",
                                    marginBottom: "4px",
                                }}>

                                    Select Aftercare Document *:
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
                                            required: 'aftercare document is required',
                                        })}
                                    /> </>}
                            </Grid>
                        </Grid>
                        <Grid item xs={3} mt={2}><InputField
                        disabled={true}
                            label={"Patient First Name :*"}
                            size={'small'}
                            placeholder={"Patient First Name"}
                            error={errors?.fname?.message}
                            register={register("fname", {
                                required:
                                    "Please enter your fname."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                          disabled={true}
                            label={"Patient Last Name :*"}
                            size={'small'}
                            placeholder={" Patient Last Name"}
                            error={errors?.lname?.message}
                            register={register("lname", {
                                required:
                                    "Please enter your lname."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                          disabled={true}
                            label={"Patient Email :*"}
                            size={'small'}
                            placeholder={"Patient Email"}
                            error={errors?.email?.message}
                            register={register("email", {
                                required:
                                    "Please enter your email."

                            })}
                        /></Grid>

                        

                    </Grid>
                    
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader} type={'submit'} title={"Send"} />
                    </Box>
                </Box>
            </Paper>
        </div >
    )
}

export default SendForm
