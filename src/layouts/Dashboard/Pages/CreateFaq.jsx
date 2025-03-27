import { Box, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import ApiServices from "../../../services/Apis";

import InputField from "../../../components/input";
import { useForm } from "react-hook-form";

import { PrimaryButton } from "../../../components/buttons";
import { showPromiseToast } from "../../../components/Toaster";

import "yet-another-react-lightbox/styles.css";
import { useNavigate } from "react-router-dom";





const CreateFaq = () => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();


    const navigate = useNavigate()


    const [loader, setLoader] = useState(false)


    const CreateFaq = async () => {
        setLoader(true);
        try {
            let obj = {
                question: getValues('question'),

                answer: getValues('answer'),


            };

            const promise = ApiServices.CreateFaq(obj);

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
                navigate("/faqs"); // Change to your desired route
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
                    Create Faq
                </Typography>


                <Box component={'form'} onSubmit={handleSubmit(CreateFaq)} >


                    <Grid container mt={4} gap={2}>

                        <Grid item xs={5}><InputField
                            label={"Question :*"}
                            size={'small'}
                            placeholder={"Question"}
                            error={errors?.question?.message}
                            register={register("question", {
                                required:
                                    "Please enter your question."

                            })}
                        /></Grid>


                        <Grid item xs={7}><InputField
                            label={"Answer :*"}
                            size={'small'}
                            multiline
                            rows={4}
                            placeholder={"Answer "}
                            error={errors?.answer?.message}
                            register={register("answer", {
                                required:
                                    "Please enter your answer."

                            })}
                        /></Grid>





                    </Grid>


                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '85%', mt: 2 }}>
                        <PrimaryButton loader={loader} disabled={loader}type={'submit'} title={"Submit"} />
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default CreateFaq;
