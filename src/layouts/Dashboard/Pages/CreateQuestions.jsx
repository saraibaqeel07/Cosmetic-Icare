import { Box, Grid, Typography, Chip, IconButton, InputLabel, Paper } from "@mui/material";
import { PrimaryButton } from "../../../components/buttons";
import InputField from "../../../components/input";
import { showPromiseToast } from "../../../components/Toaster";
import ApiServices from "../../../services/Apis";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import SelectField from "../../../components/select";

const CreateQuestions = () => {
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [options, setOptions] = useState([]);
    const [type, setType] = useState(null)

    const handleAddOption = () => {
        const newOption = getValues('newOption').trim();
        setValue('newOption', '')
        if (newOption) {
            setOptions([...options, { id: Date.now(), value: newOption }]);
            // Clear input after adding option
            // You can also reset the form field using setValue from react-hook-form if needed
        }
    };

    const handleDeleteOption = (id) => {
        const updatedOptions = options.filter(option => option.id !== id);
        setOptions(updatedOptions);
    };

    const CreateQuestion = async () => {
        setLoader(true);
        try {
            let obj = {
                question: getValues('question'),
                description: getValues('description'),
                options: options.map(option => option.value),
                type: type?.id,
                order: 1
            };

            const promise = ApiServices.CreateQuestion(obj);

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
                navigate("/appointments-questions"); // Change to your desired route
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div>
            <Paper sx={{ width: "100%", boxShadow: 'none',height:'auto' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                    Create Question
                </Typography>

                <Box component={'form'} onSubmit={handleSubmit(CreateQuestion)} >
                    <Grid container mt={4} gap={2}>
                        <Grid item xs={5}>
                            <InputField
                                label={"Question :*"}
                                size={'small'}
                                placeholder={"Question"}
                                error={errors?.question?.message}
                                register={register("question", {
                                    required: "Please enter your question."
                                })}
                            />
                        </Grid>

                        <Grid item xs={5} sm={5} >

                            <SelectField
                                size={'small'}
                                label={'Type : *'}
                                fullWidth={true}
                                options={[{ id: 'demographic', name: 'Demographic' }, { id: 'past_data', name: 'Past Data' }]}
                                selected={type}
                                onSelect={(value) => {
                                    setType(value)


                                }}
                                error={errors?.type?.message}
                                register={register("type", {
                                    required: 'Please select type.',
                                })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <InputLabel sx={{ textTransform: "capitalize", textAlign: 'left', fontWeight: 700, display: 'block' }}>

                                Options :*
                            </InputLabel>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: '49%' }}>
                                <InputField

                                    size={'small'}
                                    placeholder={"Add options"}
                                    register={register("newOption")}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddOption();
                                        }
                                    }}
                                />
                                <PrimaryButton sx={{ mb: 1 }} onClick={handleAddOption} title={"Add"} />
                            </Box>
                            {options?.map(option => (
                                <Chip
                                    key={option.id}
                                    label={option.value}
                                    onDelete={() => handleDeleteOption(option.id)}
                                    sx={{ margin: '0.5rem' }}
                                />
                            ))}
                        </Grid>
                        <Grid item xs={5}><InputField
                            label={"Description :"}
                            size={'small'}
                            multiline
                            rows={4}
                            placeholder={"Description "}
                            error={errors?.description?.message}
                            register={register("description", {
                                required:
                                    false

                            })}
                        /></Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '85%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader} type={'submit'} title={"Submit"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default CreateQuestions;
