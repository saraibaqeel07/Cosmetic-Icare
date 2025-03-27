import { useEffect, useRef, useState } from "react";
import ApiServices from "../../../services/Apis";
import { PrimaryButton } from "../../../components/buttons";
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, InputLabel, Paper, TextField, Typography } from "@mui/material";
import InputField from "../../../components/input";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { showErrorToast, showPromiseToast, showSuccessToast } from "../../../components/Toaster";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from "@mui/icons-material/Description"; // Import document icon



const UpdateAfterCareDocument = () => {
    const navigate = useNavigate()

    const { register, control, handleSubmit, setValue, getValues, formState: { errors }, reset, watch } = useForm();
    const [uploadedImages, setUploadedImages] = useState([]);

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

    const { id } = useParams()
    const fileInputRef = useRef(null);

    const [loader, setLoader] = useState(false)

    const [imageURL, setImageURL] = useState()
    const [hovered, setHovered] = useState(false);




    const handleRemoveImage = (index) => {
        setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const UpdateAfterCareDocument = async () => {
        setLoader(true);
        try {
            let obj = {
                _id:id,
                title: getValues('title'),
                content: getValues('content'),

                documents: uploadedImages

            };

            const promise = ApiServices.UpdateAfterCareDocument(obj);

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
                navigate('/staff')


            }

        } catch (error) {
            console.log(error);
            showErrorToast(error)
        } finally {

            setLoader(false);
        }
    };


    const [imageLoader, setImageLoader] = useState(false)

    const handleFileChange = async (e) => {
        setUploadedImages([

        ])
        setImageLoader(true)
        try {
            const files = e.target.files;
            console.log(files.length);
            if (files.length === 0) return; // Exit if no files are selected

            setValue("images", files, { shouldValidate: true }); // Store all files

            const uploadedImages = [];
            console.log(files.length);

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
                    uploadedImages.push("https://cosmetic.theappkit.com" + imagePath);
                    console.log("Uploaded Image URL:", "https://cosmetic.theappkit.com" + imagePath);
                }
            }

            setImageLoader(false)
            setUploadedImages(uploadedImages); // Store all uploaded image URLs
            console.log("All Uploaded Images:", uploadedImages);

        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    const getData = async () => {
        try {

            let params = {
                id: id
            }
            const data = await ApiServices.getAfterCareDocumentDetail(params);


            console.log(data);

            setValue('title', data?.data?.document?.title)
            setValue('content', data?.data?.document?.content)
            setUploadedImages(data?.data?.document?.documents)
            setImageURL(data?.data?.userDetails?.picture)
            setValue("media", { shouldValidate: true });


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    useEffect(() => {
        getData()
    }, [])



    return (
        <div>

            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none', backgroundColor: '#eff6ff', borderRadius: '12px' }}>



                <Box component={'form'} p={3} sx={{ borderRadius: '12px' }} onSubmit={handleSubmit(UpdateAfterCareDocument)} >


                    <Grid container mt={4} spacing={2}>


                        <Grid item xs={3} mt={2}><InputField
                            label={"Title :*"}
                            size={'small'}
                            placeholder={"Title"}
                            error={errors?.title?.message}
                            register={register("title", {
                                required:
                                    "Please enter your title."

                            })}
                        /></Grid>
                        <Grid item xs={3} mt={2}><InputField
                            label={"Content :*"}
                            size={'small'}
                            placeholder={"Content"}
                            error={errors?.content?.message}
                            register={register("content", {
                                required:
                                    "Please enter your content."

                            })}
                        /></Grid>

                        <Grid item xs={12} sm={5}>
                        <InputLabel sx={{    textTransform: "capitalize",mt:2,
              textAlign: "left",
              fontWeight: 600,
              fontSize: "14px",
              color: "#333",
              marginBottom: "4px", }}>

                                Upload  Documents :*
                            </InputLabel>

                            <Controller
                                name="media"
                                control={control}
                                rules={{
                                    required: "At least one media file is required",
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return "At least one media file is required";
                                        }
                                        for (let i = 0; i < value.length; i++) {
                                            if (value[i].size > 10 * 1024 * 1024) { // 10MB limit
                                                return "Each file must be smaller than 10MB";
                                            }
                                            const allowedTypes = [
                                                "image/",
                                               
                                                "application/pdf",
                                                "application/msword",
                                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            ];
                                            if (!allowedTypes.some(type => value[i].type.startsWith(type))) {
                                                return "Only images,PDFs, and Word documents are allowed";
                                            }
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange } }) => (
                                    <>
                                        <Box
                                            sx={{
                                                borderRadius: "8px",
                                                padding: "20px",
                                                textAlign: "center",
                                                cursor: "pointer",
                                                backgroundColor: "#f9f9f9",
                                                height: '135px',
                                                "&:hover": { backgroundColor: "#eef7ff" },
                                            }}
                                            onClick={() => document.getElementById("upload-media").click()}
                                        >
                                            {!imageLoader ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        accept="image/*,.pdf,.doc,.docx"
                                                        multiple
                                                        style={{ display: "none" }}
                                                        id="upload-media"
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            onChange(files); // Update react-hook-form
                                                            handleFileChange(e); // Handle upload logic
                                                        }}
                                                    />
                                                    <UploadFileIcon sx={{ fontSize: 40, color: "#0EA5EA" }} />
                                                    <Typography variant="body1" sx={{ color: "#333", mt: 1 }}>
                                                        Drag & drop or click to upload files
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: "#666" }}>
                                                        Allowed: Images, PDFs, DOC, DOCX (Max 10MB per file)
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


                            {uploadedImages?.length > 0 &&
                                <Grid item xs={12}>
                                    <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 3, mt: 3 }}>

                                        Uploaded Documents :
                                    </InputLabel>
                                </Grid>}
                            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                {uploadedImages?.length > 0 &&
                                    uploadedImages.map((file, index) => (
                                        <Box key={index} sx={{ position: "relative", textAlign: "center" }}>
                                            {/* Clickable Document Icon */}
                                            <a href={file} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                                                <DescriptionIcon sx={{ fontSize: 50, color: "#1976d2", cursor: "pointer" }} />
                                            </a>

                                            {/* File Name */}
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

                                            {/* Remove Button */}
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
                    </Grid>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={imageLoader || loader} type={'submit'} title={"Update"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default UpdateAfterCareDocument
