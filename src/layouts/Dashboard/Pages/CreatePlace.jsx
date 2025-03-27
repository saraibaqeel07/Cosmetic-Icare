import { Autocomplete, Box, Grid, InputLabel, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ApiServices from "../../../services/Apis";
import { Debounce } from "../../../utils";
import InputField from "../../../components/input";
import { useForm } from "react-hook-form";
import SelectField from "../../../components/select";
import { PrimaryButton } from "../../../components/buttons";
import { showPromiseToast } from "../../../components/Toaster";
import Lightbox from "yet-another-react-lightbox";
import { Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import { useNavigate } from "react-router-dom";
import { SlideshowLightbox } from 'lightbox.js-react'




const CreatePlace = () => {
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const navigate = useNavigate()

    const [selectedType, setSelectedType] = useState(null)
    const [loader, setLoader] = useState(false)
    const [detail, setDetail] = useState(null)
    const [selectedPlace, setSelectedPlace] = useState('')
    const [images, setImages] = useState([])


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
            let newHours = LocationDetail?.openingHours?.weekdayText?.join(", ")
            setImages(LocationDetail?.pictures?.map(pic => ({ src: pic })) ?? []);

            setValue('name', LocationDetail?.name)
            setValue('hours', newHours)
            setValue('address', LocationDetail?.address)
            setValue('website', LocationDetail?.website)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };



    const CreatePlace = async () => {
        setLoader(true);
        const srcArray = images?.map(item => item.src);
        try {
            let obj = {
                name: getValues('name'),
                website: getValues('website'),
                address: getValues('address'),
                place_id: selectedPlace?.placeId,
                type: selectedType.id,
                latitude: detail?.location?.lat,
                longitude: detail?.location?.lng,
                photos: srcArray,
                opening_hours: getValues('hours')
            };
            console.log(srcArray);

            const promise = ApiServices.CreatePlace(obj);

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
                navigate("/places"); // Change to your desired route
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    const handleSelect = async (event, newValue) => {
        console.log(newValue);
        setSelectedPlace(newValue)
        getLocationDetail(newValue?.placeId)
    };
    return (
        <div>
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                    Create Place
                </Typography>


                <Box component={'form'} onSubmit={handleSubmit(CreatePlace)} >
                    {console.log(options)}

                    <Grid container mt={4} gap={2}>
                        <Grid item xs={5}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block' }}>

                                Search Place
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
                        <Grid item xs={5}>
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
                            /></Grid>
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
                        <Grid item xs={5}><InputField
                            label={"Address :*"}
                            size={'small'}
                            placeholder={"Address"}
                            error={errors?.address?.message}
                            register={register("address", {
                                required:
                                    "Please enter your address."

                            })}
                        /></Grid>

                        <Grid item xs={5}><InputField
                            label={"Website :*"}
                            size={'small'}
                            placeholder={"Website "}
                            error={errors?.website?.message}
                            register={register("website", {
                                required:
                                    "Please enter your website."

                            })}
                        /></Grid>
                        <Grid item xs={5}><InputField
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
                        /></Grid>

                    </Grid>
                    <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block', mb: 3 }}>

                        Images :
                    </InputLabel>
                    {images?.length > 0 ? (
                        <SlideshowLightbox className=" LightBox-Div container grid grid-cols-3 gap-2 mx-auto">
                            {images.map((image, index) => (

                                <img key={index} className=" rounded" src={image.src} width={'300px'} height={'200px'} alt={`image-${index}`} style={{ borderRadius: '5px', objectFit: 'cover' }} />
                            ))}
                        </SlideshowLightbox>
                    ) : (
                        <p></p>
                    )}


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '85%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader}type={'submit'} title={"Submit"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default CreatePlace;
