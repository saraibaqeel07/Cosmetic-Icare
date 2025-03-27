import { Box, Chip, IconButton, Paper, Typography } from "@mui/material"
import DataTable from "../../../components/DataTable"
import { useEffect, useState } from "react"
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { PrimaryButton } from "../../../components/buttons";
import { useNavigate } from "react-router-dom";
import ApiServices from "../../../services/Apis";
import moment from "moment";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ConfirmationDialog from "../../../components/confirmDialog";
import { showErrorToast, showPromiseToast } from "../../../components/Toaster";
import SimpleDialog from "../../../components/dialog";
import { Grid } from "rsuite";
import InputField from "../../../components/input";
import { useForm } from "react-hook-form";
import SelectField from "../../../components/select";


const AfterCareDocuments = () => {
    const [active, setActive] = useState(false)
    const navigate = useNavigate()
    const [status, setStatus] = useState(null)
    const [data, setData] = useState([])
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [open, setOpen] = useState(false)
    const {
        register: register2,
        handleSubmit: handleSubmit2,
        setValue: setValue2,
        getValues: getValues2,
        reset,
        formState: { errors: errors2 },

    } = useForm();

    const getData = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getAfterCareDocuments(params);


            setData(data?.data?.documents)


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
            header: "Title",
            accessorKey: "title",

        },
        {
            header: "Content",
            accessorKey: "content",

        },
     
      
        {
            header: "Actions",
            cell: ({ row }) => (

                <Box variant="contained" color="primary" sx={{ cursor: 'pointer', display: 'flex', gap: 2 }} >
                    <IconButton onClick={() => { navigate(`/patient-detail/${row?.original?._id}`) }}>
                        <NorthEastIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/update-aftercare-document/${row?.original?._id}`)}>
                        <DriveFileRenameOutlineIcon sx={{ fontSize: '16px' }} />
                    </IconButton>

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

            const promise = ApiServices.DeleteAfterCareDoc(obj);

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
            showErrorToast(error)
        }
        finally {
            getData()
        }

    };
    const UpdateStaff = async () => {

        try {
            let obj = {
                id: selectedRow?._id,
                in_active: status?.id
            };

            const promise = ApiServices.UpdateStaff(obj);

            // Handle the API response properly
            const response = await promise;
            console.log(response);

            showPromiseToast(
                promise,
                "Saving...",
                "Added Successfully",
                "Something Went Wrong"
            );

            setOpen(false)

        } catch (error) {
            console.log(error);
        }
        finally {
            getData()
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
                width={'300px'}
                title={'Update Status'}
            >
                <Box component="form" onSubmit={handleSubmit2(UpdateStaff)}>
                    <Grid container >
                        <Grid item xs={12} sm={12} mt={2}>

                            <Typography variant="p" sx={{ mt: 1, fontWeight: 500 }}>
                                Type:
                            </Typography>
                            <SelectField
                                size={'small'}
                                newLabel={'Select Type'}
                                fullWidth={true}
                                options={[{ id: false, name: 'Active' }, { id: true, name: 'InActive' }]}
                                selected={status}
                                onSelect={(value) => {
                                    setStatus(value)
                                    getData(value)

                                }}
                            // error={errors2?.type?.message}
                            // register={register2("type", {
                            //     required: 'Please select type.',
                            // })}
                            />

                        </Grid>






                        <Box sx={{ display: 'flex', justifyContent: 'center' }} >

                            <PrimaryButton bgcolor={'black'} title="Submit" type="submit" />

                        </Box>

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
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none', backgroundColor: '#eff6ff !important', borderRadius: '12px' }}>
                <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mt: 4,mb:4, fontWeight: 600 }}>
                    Aftercare Documents
                </Typography>
                        <PrimaryButton onClick={() => navigate('/create-aftercare-document')} title={"Create"} />
                    </Box>
                    {<DataTable data={data} columns={columns} />}
                </Box>
            </Paper>
        </div>
    )
}

export default AfterCareDocuments
