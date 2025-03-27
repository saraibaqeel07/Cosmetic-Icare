import { Box, Chip, IconButton, Paper, Typography } from "@mui/material"
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
import NorthEastIcon from '@mui/icons-material/NorthEast';


const Posts = () => {

    const navigate = useNavigate()
    const [data, setData] = useState()
    const [confirmationDialog, setConfirmationDialog] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)


    const getData = async () => {
        try {
            let params = {
                page: 1,
                limit: 999
            };

            const data = await ApiServices.getPosts(params);


            setData(data?.data?.posts)


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
                        {row?.original?.created_by?.first_name + ' ' + row?.original?.created_by?.last_name}
                    </Box>
                );
            },
        },

        {
            header: "Title",
            accessorKey: "title",

        },
        {
            header: "Description",
            accessorKey: "description",

        },
        {
            header: "Likes",
            accessorKey: "likes",
            cell: ({ row }) => {

                return (
                    <Box>
                        {row?.original?.likes?.length}
                    </Box>
                );
            },

        },
        {
            header: "Comments",
            accessorKey: "comments_count",

        },

        {
            header: "Actions",
            cell: ({ row }) => (

                <Box variant="contained" color="primary" sx={{ cursor: 'pointer', display: 'flex', gap: 2 }} >


                    <IconButton onClick={() => { setSelectedRow(row?.original); setConfirmationDialog(true) }}>
                        <DeleteOutlineIcon sx={{ fontSize: '16px' }} />
                    </IconButton>
                    <IconButton onClick={() => { navigate(`/update-post/${row?.original?._id}`) }}>
                        <NorthEastIcon sx={{ fontSize: '16px' }} />
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

            const promise = ApiServices.DeletePost(obj);

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
    useEffect(() => {
        getData()

    }, [])

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
                        Posts
                    </Typography>
                    <PrimaryButton onClick={() => navigate('/create-post')} title={"Create"} />
                </Box>
                {data?.length > 0 && <DataTable data={data} columns={columns} />}

            </Paper>
        </div>
    )
}

export default Posts
