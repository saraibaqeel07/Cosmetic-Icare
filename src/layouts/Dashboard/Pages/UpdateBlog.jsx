import { Autocomplete, Box, Button, CircularProgress, Grid, IconButton, InputLabel, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ApiServices from "../../../services/Apis";
import { Debounce } from "../../../utils";
import InputField from "../../../components/input";
import { Controller, useForm } from "react-hook-form";
import SelectField from "../../../components/select";
import { PrimaryButton } from "../../../components/buttons";
import { showErrorToast, showPromiseToast } from "../../../components/Toaster";
import Lightbox from "yet-another-react-lightbox";
import { Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { SlideshowLightbox } from 'lightbox.js-react'
import UploadFile from "../../../components/upload/UploadFile";
import instance from "../../../config/axios";
import routes from "../../../services/Apis/routes";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";





const UpdateBlog = () => {
    const { register, handleSubmit, getValues, setValue, control, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const {id} = useParams()
    const navigate = useNavigate()
    const [progress4, setProgress4] = useState(0);
    const [uploadedSize4, setUploadedSize4] = useState(0);
    const allowOnlyImage = ['image/png', 'image/jpg', 'image/jpeg']
    const [selectedType, setSelectedType] = useState(null)
    const [loader, setLoader] = useState(false)
    const [detail, setDetail] = useState(null)
    const [selectedPlace, setSelectedPlace] = useState('')
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [topics, setTopics] = useState([])
    const [images, setImages] = useState([])
    const [previewImages, setPreviewImages] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [loading, setLoading] = useState(false);
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
                    "https://server.naesminc.org/api/system/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                const imagePath = response?.data?.data?.path;
                if (imagePath) {
                    uploadedImages.push("https://server.naesminc.org" + imagePath);
                    console.log("Uploaded Image URL:", "https://server.naesminc.org" + imagePath);
                }
            }

            setImageLoader(false)

            setUploadedImages(uploadedImages); // Store all uploaded image URLs
            console.log("All Uploaded Images:", uploadedImages);

        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };





  
    const UpdateBlog = async () => {
        setLoader(true);
        console.log(selectedPlace);

        console.log(uploadedImages);

        try {
            let obj = {
                _id:id,
                title: getValues('title'),
                short_description: getValues('description'),
                link: getValues('link'),
                content: getValues('content'),
                image: uploadedImages[0]


            };


            const promise = ApiServices.UpdateBlog(obj);

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
                navigate("/blogs"); // Change to your desired route
            }

        } catch (error) {
            console.log(error);
            showErrorToast(error)
        } finally {
            setLoader(false);
        }
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };


   
    const getBlogData = async () => {
        try {
            let params = {
                id: id,
                
            };

            const data = await ApiServices.getBlogData(params);

            setValue('title',data?.data?.blog?.title)
            setValue('description',data?.data?.blog?.short_description)
            setValue('content',data?.data?.blog?.content)
            setValue('link',data?.data?.blog?.link)

            
        
            setUploadedImages([data?.data?.blog?.image])
            setValue("image", { shouldValidate: true });

        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
  
   useEffect(() => {
    getBlogData()
   }, [])
   

    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                    Update Blog
                </Typography>


                <Box component={'form'} onSubmit={handleSubmit(UpdateBlog)} >
                    {console.log(options)}

                    <Grid container mt={4} gap={2}>

                        {/* <Grid item xs={5}>
                            <SelectField
                                size={'small'}
                                label={'Type :*'}
                                options={[
                                    {
                                        "id": "Club",
                                        "name": "Bar/Club"
                                    },
                                    {
                                        "id": "Restaurant",
                                        "name": "Restaurant"
                                    }
                                ]}
                                selected={selectedType}
                                onSelect={(value) => setSelectedType(value)}
                                error={errors?.type?.message}
                                register={register("type", {
                                    required: 'Please select type.',
                                })}
                            /></Grid> */}
                        <Grid item xs={5}><InputField
                            label={"Title :*"}
                            size={'small'}
                            placeholder={"Title"}
                            error={errors?.title?.message}
                            register={register("title", {
                                required:
                                    "Please enter your title."

                            })}
                        /></Grid>
                        <Grid item xs={5}><InputField
                            label={"Link :"}
                            size={'small'}
                            placeholder={"Link"}
                            error={errors?.link?.message}
                            register={register("link", {
                                required:
                                    false
                            })}
                        /></Grid>



                        <Grid item xs={5}><InputField
                            label={"Short Description:*"}
                            size={'small'}
                            multiline
                            rows={4}
                            placeholder={"Short Description  "}
                            error={errors?.description?.message}
                            register={register("description", {
                                required:
                                    "Please enter your description."

                            })}
                        /></Grid>
                        <Grid item xs={5}><InputField
                            label={"Content:*"}
                            size={'small'}
                            multiline
                            rows={4}
                            placeholder={"Content  "}
                            error={errors?.content?.message}
                            register={register("content", {
                                required:
                                    "Please enter your content."

                            })}
                        /></Grid>


                        <Grid item xs={12} sm={5}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 2 }}>

                                Upload  Image :*
                            </InputLabel>

                            <Controller
                                name="image"
                                control={control}
                                rules={{
                                    required: "Image is required",
                                    validate: (value) => {
                                        if (!value || value.length === 0) {
                                            return "Image is required";
                                        }
                                        for (let i = 0; i < value.length; i++) {
                                            if (value[i].size > 10 * 1024 * 1024) { // Increased limit to 10MB
                                                return "Each file must be smaller than 10MB";
                                            }
                                            if (!["image/"].some(type => value[i].type.startsWith(type))) {
                                                return "Only images are allowed";
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
                                                        Drag & drop or click to upload media
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

                    </Grid>
                    {uploadedImages?.length > 0 && <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 3, mt: 3 }}>

                        Images :
                    </InputLabel>}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {uploadedImages?.length > 0 ? (
                            uploadedImages.map((file, index) => {
                                const isVideo = file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".avi") || file.endsWith(".webm");

                                return (
                                    <Box key={index} sx={{ position: "relative", display: "inline-block", mt: 1 }}>
                                        {/* Image or Video */}
                                        {isVideo ? (
                                            <video
                                                width="300px"
                                                height="200px"
                                                controls
                                                style={{ borderRadius: "5px", objectFit: "cover" }}
                                            >
                                                <source src={file} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <img
                                                className="rounded"
                                                src={file}
                                                width="300px"
                                                height="200px"
                                                alt={`media-${index}`}
                                                style={{ borderRadius: "5px", objectFit: "cover" }}
                                            />
                                        )}

                                        {/* Remove Button */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 5,
                                                right: 5,
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => handleRemoveImage(index)}
                                                sx={{
                                                    backgroundColor: "rgba(0,0,0,0.6)",
                                                    color: "#fff",
                                                    "&:hover": { backgroundColor: "red" },
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    p: 2,
                                                }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                );
                            })
                        ) : (
                            <p></p>
                        )}
                    </Box>



                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '85%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader}type={'submit'} title={"Submit"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default UpdateBlog;
