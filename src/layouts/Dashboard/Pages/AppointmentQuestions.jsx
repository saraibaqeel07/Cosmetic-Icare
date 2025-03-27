
import {

    Paper,

    Typography,
    Button,
    Grid,
    Box,
    IconButton, // Import TableSortLabel
} from "@mui/material"
import DataTable from "../../../components/DataTable"
import ApiServices from "../../../services/Apis";
import { useState } from "react";
import SelectField from "../../../components/select";

import ConfirmationDialog from "../../../components/confirmDialog";
import { showPromiseToast } from "../../../components/Toaster";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { PrimaryButton } from "../../../components/buttons";
import { useNavigate } from "react-router-dom";


const AppointmentQuestions = () => {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const [type, setType] = useState(null)
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)

    const getData = async (type) => {
        try {
            let params = {
                type: type?.id
            }


            const data = await ApiServices.getQuestions(params);
            console.log(data);
            setData(data?.data?.questions)




        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };


    // Column definitions with sorting
    const columns = [
        {
            header: "Question",
            accessorKey: "question",
        },
        {
            header: "Type",
            accessorKey: "type",
            cell: ({ row }) => (
                <Box sx={{textTransform:"capitalize"}}>
                    {row?.original?.type}
                </Box>
            ),
        },
        {
            header: "Options",
            accessorKey: "answer",
            cell: ({ row }) => (
                <Box>
                    {row?.original?.options?.join(',')}
                </Box>
            ),
        },
        {
            header: "Description",
            accessorKey: "description",
            
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <Box>
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

            const promise = ApiServices.DeleteQuestion(obj);

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
            getData()
        }

    };


    return (
        <div>
            <ConfirmationDialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                message={"Are you sure you want to delete?"}
                action={async () => {
                    setConfirmationDialog(false);
                    HandleDelete()

                }}
            />
            <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>

                <Grid container justifyContent={'space-between'}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                        Appointment Questions
                    </Typography>
                    <Grid item xs={3} sm={3} display={'flex'} gap={1} justifyContent={'flex-end'} alignItems={'flex-start'}>
                        <Typography variant="p" sx={{ mt: 1, fontWeight: 500 }}>
                            Type:
                        </Typography>
                        <SelectField
                            size={'small'}
                            newLabel={'Select Type'}
                            fullWidth={true}
                            options={[{ id: 'demographic', name: 'Demographic' }, { id: 'past_data', name: 'Past Data' }]}
                            selected={type}
                            onSelect={(value) => {
                                setType(value)
                                getData(value)

                            }}
                        // error={errors2?.type?.message}
                        // register={register2("type", {
                        //     required: 'Please select type.',
                        // })}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3} display={'flex'} gap={1} justifyContent={'flex-end'} alignItems={'flex-start'}>
                       <PrimaryButton  onClick={()=> navigate('/create-question')} title={"Create"} />
                    </Grid>
                </Grid>
                <DataTable data={data} columns={columns} />

            </Paper>
        </div>
    )
}

export default AppointmentQuestions;
