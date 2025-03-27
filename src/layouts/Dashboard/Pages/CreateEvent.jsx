import { Autocomplete, Box, Button, CircularProgress, Grid, IconButton, InputLabel, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { SlideshowLightbox } from 'lightbox.js-react'
import UploadFile from "../../../components/upload/UploadFile";
import instance from "../../../config/axios";
import routes from "../../../services/Apis/routes";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";





const CreateEvent = () => {
    const { register, handleSubmit, getValues, setValue, control, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const navigate = useNavigate()
    const [progress4, setProgress4] = useState(0);
    const [uploadedSize4, setUploadedSize4] = useState(0);
    const allowOnlyImage = ['image/png', 'image/jpg', 'image/jpeg']
    const [selectedType, setSelectedType] = useState(null)
    const [loader, setLoader] = useState(false)
    const [detail, setDetail] = useState(null)
    const [selectedPlace, setSelectedPlace] = useState('')
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




    const getLocation = async (value) => {
        try {
            let params = {
                input: value, // Ensure input is set properly
            };

            const data = await ApiServices.geoLocation(params);
            console.log(data?.data?.predictions);


            setOptions(data?.data?.predictions);


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    const getFileSize = (size) => {
        let fileSize
        if (size < 1024) {
            fileSize = `${size} Bytes`
        } else if (size < 1024 * 1024) {
            const fileSizeInKBs = size / 1024;
            fileSize = `${fileSizeInKBs.toFixed(2)} KB`
        } else {
            const fileSizeInMBs = size / (1024 * 1024);
            fileSize = `${fileSizeInMBs.toFixed(2)} MB`
        }
        return fileSize
    }

    const getLocationDetail = async (id) => {
        try {
            let params = {
                place_id: id, // Ensure input is set properly
            };

            const data = await ApiServices.getLocationDetail(params);
            console.log(data?.data?.placeDetails);
            let LocationDetail = await data?.data?.placeDetails
            setDetail(LocationDetail)
            console.log(LocationDetail?.openingHours?.weekdayText?.join(", "));
            // let newHours = LocationDetail?.openingHours?.weekdayText?.join(", ")
            setImages(LocationDetail?.pictures?.map(pic => ({ src: pic })) ?? []);

            // setValue('name', LocationDetail?.name)
            // setValue('hours', newHours)
            setValue('address', LocationDetail?.address)
            setValue('website', LocationDetail?.website)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };



    const CreateEvent = async () => {
        setLoader(true);
        console.log(selectedPlace);


        try {
            let obj = {
                name: getValues('name'),
                // website: getValues('website'),
                address: selectedPlace?.description,
                place_id: selectedPlace?.placeId,
                // type: selectedType.name,
                latitude: detail?.location?.lat,
                longitude: detail?.location?.lng,
                photos: uploadedImages,
                description:getValues('description'),
                start_time: getValues('starttime'),
                end_time: getValues('endtime')
            };


            const promise = ApiServices.CreateEvent(obj);

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
                navigate("/events"); // Change to your desired route
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    const handleRemoveImage = (index) => {
        setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };


    const handleUpload4 = async (file, docs, type) => {
        setProgress4(0)
        try {
            const formData = new FormData();
            formData.append('document', file);
            const { data } = await instance.post(routes.uploadDocuments, formData, {
                onUploadProgress: (progressEvent) => {
                    const uploadedBytes = progressEvent.loaded;
                    const percentCompleted = Math.round((uploadedBytes * 100) / progressEvent.total);

                    setProgress4(percentCompleted);
                    setUploadedSize4(getFileSize(uploadedBytes))
                },
            });
            if (data) {
                docs[0].isUpload = true
                docs[0].file = data?.data?.nations

            }
        } catch (error) {
            showErrorToast(error)
        }
    }
    const handleUploadDocument4 = async (e, type) => {
        try {
            e.preventDefault();
            const file = e.target.files[0]
            let arr = [{
                name: file?.name,
                file: '',
                type: file?.type.split('/')[1],
                size: getFileSize(file.size),
                isUpload: false
            }]

            // *For Check Image Format
            if (type !== 'picture' && allowOnlyImage.includes(file.type)) {
                handleUpload4(file, arr, type)

            } else {
                showErrorToast(`Only Image formats is supported`)
            }
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleSelect = async (event, newValue) => {
        console.log(newValue);
        setSelectedPlace(newValue)
        getLocationDetail(newValue?.placeId)
    };
    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                    Create Event
                </Typography>


                <Box component={'form'} onSubmit={handleSubmit(CreateEvent)} >
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
                            label={"Name :*"}
                            size={'small'}
                            placeholder={"Name"}
                            error={errors?.name?.message}
                            register={register("name", {
                                required:
                                    "Please enter your name."

                            })}
                        /></Grid>
                        <Grid item xs={5}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block' }}>

                                Address
                            </InputLabel>
                            <Autocomplete
                                size="small"
                                aria-placeholder="Search Place"
                                disableClearable
                                filterOptions={(options) => options} // Prevents filtering
                                sx={{
                                    border: '2px solid #191d31',
                                    borderRadius: '5px ',
                                    outline: "none !important",
                                    mt: 1,
                                    '& fieldset': { border: 'none !important' },
                                    '& .MuiSvgIcon-root':{display:'none'},
                                    "&.Mui-focused": {
                                        '& fieldset': { border: 'none !important' },
                                        "svg": {
                                            "path": {
                                                fill: "#0076bf"
                                            }
                                        }
                                    }
                                }}
                                onInputChange={(event, newInputValue) => Debounce(() => getLocation(newInputValue))}
                                options={options}
                                getOptionLabel={(option) => option?.description}
                                onChange={handleSelect}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" />
                                )}
                            />
                        </Grid>


                        {/* <Grid item xs={5}><InputField
                            label={"Website :*"}
                            size={'small'}
                            placeholder={"Website "}
                            error={errors?.website?.message}
                            register={register("website", {
                                required:
                                    "Please enter your website."

                            })}
                        /></Grid> */}
                        <Grid item xs={5}><InputField
                            label={"Start Time :*"}
                            size={'small'}

                            placeholder={"Start Time  "}
                            error={errors?.starttime?.message}
                            register={register("starttime", {
                                required:
                                    "Please enter your start time."

                            })}
                        /></Grid>
                        <Grid item xs={5}><InputField
                            label={"End Time :*"}
                            size={'small'}

                            placeholder={"End Time "}
                            error={errors?.endtime?.message}
                            register={register("endtime", {
                                required:
                                    "Please enter your end time."

                            })}
                        /></Grid>
                        {/* <Grid item xs={5}><InputField
                            label={"Opening Hours :*"}
                            size={'small'}
                            multiline
                            rows={4}
                            placeholder={"Opening Hours "}
                            error={errors?.hours?.message}
                            register={register("hours", {
                                required:
                                    "Please enter your hours."

                            })}
                        /></Grid> */}
                        <Grid item xs={5}><InputField
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

                                Upload  Images/Videos :*
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
                                                        accept="image/*,audio/*,video/*"
                                                        multiple
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
                                                        Allowed: Images, Audio, Videos (Max 10MB per file)
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

                        Images/Videos :
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

export default CreateEvent;
