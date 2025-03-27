import { Box, Card, Chip, Grid, IconButton, Paper, Typography } from "@mui/material"
import DataTable from "../../../components/DataTable"
import { useEffect, useState } from "react"
import { PrimaryButton } from "../../../components/buttons";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../../services/Apis";
import moment from "moment";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ConfirmationDialog from "../../../components/confirmDialog";
import { showPromiseToast } from "../../../components/Toaster";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InputField from "../../../components/input";
import SimpleDialog from "../../../components/dialog";
import { useForm } from "react-hook-form";


const Topics = () => {

    const navigate = useNavigate()
    const [data, setData] = useState()
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        getValues: getValues2,
        reset,
        formState: { errors: errors2 },

    } = useForm();
    const {
        register: register3,
        handleSubmit: handleSubmit3,
        setValue: setValue3,
        getValues: getValues3,
        
        formState: { errors: errors3 },

    } = useForm();

    const getData = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getTopics(params);


            setData(data?.data?.topics)


        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };
    // // Dummy data
    // const data = [
    //     { id: 1, firstName: "John", lastName: "Doe", age: 30, city: "New York" },
    //     { id: 2, firstName: "Jane", lastName: "Smith", age: 25, city: "Los Angeles" },
    //     { id: 3, firstName: "Bob", lastName: "Johnson", age: 35, city: "Chicago" },
    //     { id: 4, firstName: "Alice", lastName: "Brown", age: 28, city: "Houston" },
    //     { id: 5, firstName: "Charlie", lastName: "Davis", age: 42, city: "Phoenix" },
    //     { id: 6, firstName: "Eva", lastName: "Wilson", age: 31, city: "Philadelphia" },
    //     { id: 7, firstName: "Frank", lastName: "Moore", age: 29, city: "San Antonio" },
    //     { id: 8, firstName: "Grace", lastName: "Taylor", age: 36, city: "San Diego" },
    //     { id: 9, firstName: "Henry", lastName: "Anderson", age: 41, city: "Dallas" },
    //     { id: 10, firstName: "Ivy", lastName: "Thomas", age: 27, city: "San Jose" },
    // ]

    // Column definitions with sorting
    const columns = [

        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => {

                return (
                    <Box>
                        {row?.original?.first_name +  row?.original?.last_name}
                    </Box>
                );
            },
        },




        {
            header: "Answer",
            accessorKey: "answer",
            cell: ({ row }) => {

                return (
                    <Box>
                        {row?.original?.answer}
                    </Box>
                );
            },
        },
        {
            header: "Actions",
            cell: ({ row }) => (

                <Box variant="contained" color="primary" sx={{ cursor: 'pointer', display: 'flex', gap: 2 }} >


                    <IconButton onClick={() => { setSelectedRow(row?.original); setConfirmationDialog(true) }}>
                        <DeleteOutlineIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                </Box>
            ),
        },

    ]

    const HandleDelete = async () => {

        try {
            let obj = {
                id: selectedRow?._id
            };

            const promise = ApiServices.DeleteTopic(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);

            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );



        } catch (error) {
            console.log(error);
        }
        finally {
            setOpen(false)
            setOpen2(false)
            getData()
        }

    };
    const CreateTopic = async () => {

        try {
            let obj = {
              
                title:getValues2('title')

            };

            const promise = ApiServices.CreateTopic(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);
           
            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );



        } catch (error) {
            console.log(error);
        }
        finally {
            setOpen(false)
            setValue2('title','')
            setOpen2(false)
            getData()
        }

    };
    const UpdateTopic = async () => {

        try {
            let obj = {
                _id: selectedRow?._id,
                title:getValues3('title')

            };

            const promise = ApiServices.UpdateTopic(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);
           
            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );
            getData()


        } catch (error) {
            console.log(error);
        }
        finally {
            setOpen(false)
            setOpen2(false)
            
        }

    };
    useEffect(() => {
        getData()

    }, [])

    return (
        <div>
            <SimpleDialog
                open={open}
                onClose={() => setOpen(false)}
                title={'Update Topic'}
            >
                <Box component="form" onSubmit={handleSubmit2(CreateTopic)}>
                    <Grid container >
                        <Grid item xs={12} sm={12} mt={2}>
                            <InputField
                                label={"Title :"}
                                size={'small'}

                                placeholder={"Title"}
                                error={errors2?.title?.message}
                                register={register2("title", {
                                    required:
                                        'title is required'

                                })}
                            />
                        </Grid>






                        <Grid container sx={{ justifyContent: 'center' }}>
                            <Grid item xs={6} sm={6} sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: '25px' }}>
                                <PrimaryButton bgcolor={'black'} title="Submit" type="submit" />
                               
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>
            </SimpleDialog>
            <SimpleDialog
                open={open2}
                onClose={() => setOpen2(false)}
                title={'Update Topic'}
            >
                <Box component="form" onSubmit={handleSubmit3(UpdateTopic)}>
                    <Grid container >
                        <Grid item xs={12} sm={12} mt={2}>
                            <InputField
                                label={"Title :"}
                                size={'small'}

                                placeholder={"Title"}
                                error={errors3?.title?.message}
                                register={register3("title", {
                                    required:
                                        'title is required'

                                })}
                            />
                        </Grid>






                        <Grid container sx={{ justifyContent: 'center' }}>
                            <Grid item xs={6} sm={6} sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: '25px' }}>
                                <PrimaryButton bgcolor={'black'} title="Submit" type="submit" />
                               
                            </Grid>
                        </Grid>

                    </Grid>
                </Box>
            </SimpleDialog>
            <ConfirmationDialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                message={"Are you sure you want to delete?"}
                action={async () => {
                    setConfirmationDialog(false);
                    HandleDelete()

                }}
            />
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none', p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 500 }}>
                        Topics
                    </Typography>
                    <PrimaryButton onClick={() => { setOpen(true)}} title="Create" />
                </Box>

                <Grid container spacing={2}>
                    {data?.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    bgcolor: index % 2 === 0 ? "primary.light" : "secondary.light",
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Typography variant="h6" sx={{ color: 'white' }} fontWeight={500}>
                                    {item.title}
                                </Typography>
                                <Box>
                                    <IconButton onClick={() => { setSelectedRow(item); setConfirmationDialog(true) }}>
                                        <DeleteOutlineIcon sx={{ fontSize: '22px', color: 'white' }} />
                                    </IconButton>
                                    <IconButton onClick={() => { setValue3('title',item?.title); setSelectedRow(item); setOpen2(true) }}>
                                        <ModeEditIcon sx={{ fontSize: '22px', color: 'white' }} />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </Paper>

        </div>
    )
}

export default Topics
