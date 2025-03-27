import { Avatar, Box, CircularProgress, Grid, IconButton, InputLabel, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ApiServices from "../../../services/Apis";

import InputField from "../../../components/input";
import { Controller, useForm } from "react-hook-form";
import SelectField from "../../../components/select";
import { PrimaryButton } from "../../../components/buttons";
import { showPromiseToast } from "../../../components/Toaster";

import "yet-another-react-lightbox/styles.css";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import UploadIcon from "@mui/icons-material/Upload";




const UpdateDoctor = () => {
    const { register, control, handleSubmit, getValues, setValue, formState: { errors }, watch } = useForm();
    const { state } = useLocation()
    const [options, setOptions] = useState([]);
    const navigate = useNavigate()
    const fileInputRef = useRef(null);
    const [imageLoader, setImageLoader] = useState(false)
    const [selectedSpecialty, setSelectedSpecialty] = useState(null)
    const [loader, setLoader] = useState(false)


    const [imageURL, setImageURL] = useState()
    const [hovered, setHovered] = useState(false);



    const GetSpecialty = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.GetSpecialty(params);


            console.log(data?.data?.specialties);
            const specialtiesWithId = data?.data?.specialties.map((name) => ({
                id: name, // Assigning a unique ID starting from 1
                name: name
            }));
            setOptions(specialtiesWithId)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

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
        finally{
            setImageLoader(false)
        }
    };
    console.log(watch());


    const UpdateDoctor = async () => {
        setLoader(true);
        try {
            let obj = {
                _id: state?._id,
                name: getValues('name'),

                location: getValues('location'),
                picture: imageURL,
                specialty: selectedSpecialty?.id
            };

            const promise = ApiServices.UpdateDoctor(obj);

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
                navigate("/doctors"); // Change to your desired route
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };
    useEffect(() => {
        GetSpecialty()
        console.log(state);
        if (state) {
            setImageURL(state?.picture)
            setValue('name', state?.name)

            setValue("image", { shouldValidate: true });
            setSelectedSpecialty({ id: state?.specialty, name: state?.specialty })
            setValue('specialty', { id: state?.specialty, name: state?.specialty })
        }

    }, [])



    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                    Update Doctor
                </Typography>


                <Box component={'form'} onSubmit={handleSubmit(UpdateDoctor)} >


                    <Grid container mt={4} gap={2}>

                        <Grid item xs={12}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block' }}>

                                Profile Picture :
                            </InputLabel>
                            <Controller
                                name="image"
                                control={control}
                                rules={{ required: false }}
                                render={({ field }) => (
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
                                            src={imageLoader ? "" : imageURL} // Hide image when loading
                                            alt="Profile"
                                            sx={{
                                                position: "relative",
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "50%",
                                                fontSize: 24,
                                                backgroundColor: imageLoader ? "rgba(0, 0, 0, 0.1)" : imageURL ? "" : "#0EA5EA",
                                                color: "white",
                                                cursor: "pointer",
                                                objectFit: "cover",
                                                textTransform: "capitalize",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            onClick={handleImageClick}
                                        >
                                            {imageLoader && (
                                                <CircularProgress size={30} sx={{ color: "white", position: "absolute" }} />
                                            )}
                                        </Avatar>

                                        {hovered && !imageLoader && (
                                            <IconButton
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
                                            </IconButton>
                                        )}

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
                            <SelectField
                                size={'small'}
                                label={'Specialty :*'}
                                options={options}
                                selected={selectedSpecialty}
                                addNew={(newValue) => setOptions([...options, { id: newValue, name: newValue }])}
                                onSelect={(value) => setSelectedSpecialty(value)}
                                error={errors?.specialty?.message}
                                register={register("specialty", {
                                    required: 'Please select specialty.',
                                })}
                            /></Grid>





                    </Grid>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '85%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader || imageLoader} type={'submit'} title={"Update"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default UpdateDoctor;
