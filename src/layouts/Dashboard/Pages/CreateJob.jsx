import { Avatar, Box, CircularProgress, Grid, IconButton, InputLabel, Paper, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ApiServices from "../../../services/Apis";

import InputField from "../../../components/input";
import { Controller, useForm } from "react-hook-form";

import { PrimaryButton } from "../../../components/buttons";
import { showPromiseToast } from "../../../components/Toaster";

import "yet-another-react-lightbox/styles.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import UploadIcon from "@mui/icons-material/Upload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";




const CreateJob = () => {
    const { register, control, handleSubmit, getValues, setValue, formState: { errors } } = useForm();

    const [imageLoader, setImageLoader] = useState(false)
    const navigate = useNavigate()
    const fileInputRef = useRef(null);

    const [loader, setLoader] = useState(false)

    const [imageURL, setImageURL] = useState()
    const [hovered, setHovered] = useState(false);




    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        setImageLoader(true)
        try {
            const file = e.target.files[0];
            if (file) {
                setValue("image", file, { shouldValidate: true }); // Set value and trigger validation
            }
            const formData = new FormData();
            formData.append("document", e.target.files[0]);

            const response = await axios.post(
                ' https://server.naesminc.org/api/system/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log(response?.data?.data?.path);

            setImageURL('https://server.naesminc.org' + response?.data?.data?.path);


        } catch (error) {
            console.log(error);

        }
        finally {
            setImageLoader(false)
        }
    };

    const CreateJob = async () => {
        setLoader(true);
        try {
            let obj = {
                name: getValues('name'),

                location: getValues('location'),
                description: getValues('description'),
                link: getValues('link'),
                picture: imageURL,

            };

            const promise = ApiServices.CreateJob(obj);

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
                navigate("/jobs"); // Change to your desired route
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };




    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                    Create Job
                </Typography>


                <Box component={'form'} onSubmit={handleSubmit(CreateJob)} >


                    <Grid container mt={4} gap={2}>

                        {/* <Grid item xs={12}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block' }}>

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
                                            src={imageURL}
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
                        </Grid> */}
                        <Grid item xs={5}><InputField
                            label={"Title :*"}
                            size={'small'}
                            placeholder={"Title"}
                            error={errors?.name?.message}
                            register={register("name", {
                                required:
                                    "Please enter your name."

                            })}
                        /></Grid>
                        {/* <Grid item xs={5}><InputField
                            label={"Location :*"}
                            size={'small'}
                            placeholder={"Location"}
                            error={errors?.location?.message}
                            register={register("location", {
                                required:
                                    "Please enter your location."

                            })}
                        /></Grid> */}
                        <Grid item xs={5}><InputField
                            label={"Link :*"}
                            size={'small'}
                            placeholder={"Link"}
                            error={errors?.link?.message}
                            register={register("link", {
                                required:
                                    "Please enter your link."

                            })}
                        /></Grid>
                        <Grid item xs={10.2}><InputField
                            label={"Description :*"}
                            size={'small'}
                            multiline
                            rows={4}
                            placeholder={"Description "}
                            error={errors?.description?.message}
                            register={register("description", {
                                required:
                                    "Please enter your description."

                            })}
                        /></Grid>


                        <Grid item xs={12} sm={5}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 2 }}>

                                Upload  Image :
                            </InputLabel>

                            <Controller
                                name="media"
                                control={control}
                                rules={{
                                    required: false,
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return false;
                                        }
                                        for (let i = 0; i < value.length; i++) {
                                            if (value[i].size > 10 * 1024 * 1024) { // Increased limit to 10MB
                                                return "Each file must be smaller than 10MB";
                                            }
                                            if (!["image/", "audio/", "video/"].some(type => value[i].type.startsWith(type))) {
                                                return "Only images, audio, and videos are allowed";
                                            }
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange } }) => (
                                    <>
                                        <Box
                                            sx={{
                                                border: "2px dashed #0EA5EA",
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
                                                        accept="image/*"

                                                        style={{ display: "none" }}
                                                        id="upload-media"
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            onChange(files); // Update react-hook-form
                                                            handleFileChange(e); // Handle upload logic
                                                        }}
                                                    />
                                                    <CloudUploadIcon sx={{ fontSize: 40, color: "#0EA5EA" }} />
                                                    <Typography variant="body1" sx={{ color: "#333", mt: 1 }}>
                                                        Drag & drop or click to upload image
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: "#666" }}>
                                                        Allowed: Image (Max 10MB)
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
                        {imageURL && <Grid item xs={5} >
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block' }}>

                                 Picture :
                            </InputLabel>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>

                            
                            <Box component={'img'} mt={1.5} src={imageURL} width={'180px'} height={'180px'}>

                            </Box>
                            </Box>
                        </Grid>}

                    </Grid>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '85%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader}type={'submit'} title={"Submit"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default CreateJob;
