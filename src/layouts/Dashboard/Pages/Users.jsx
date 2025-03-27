import { Box, Chip, Grid, IconButton, Paper, Typography } from "@mui/material"
import DataTable from "../../../components/DataTable"
import { useEffect, useState } from "react"
import NorthEastIcon from '@mui/icons-material/NorthEast';
import ApiServices from "../../../services/Apis";
import { PrimaryButton } from "../../../components/buttons";
import { useNavigate } from "react-router-dom";
import SimpleDialog from "../../../components/dialog";
import SelectField from "../../../components/select";
import { useForm } from "react-hook-form";
import InputField from "../../../components/input";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { showPromiseToast } from "../../../components/Toaster";


const Users = () => {
  const navigate = useNavigate()
  const [active, setActive] = useState(false)
  const [data, setData] = useState([])
  const [selectedRows, setSelectedRows] = useState([]);
  const [loader, setLoader] = useState(false)
  const [notificationDialog, setNotificationDialog] = useState(false)
  const [type, setType] = useState(null)
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

      const data = await ApiServices.getUsers(params);


      setData(data?.data?.users)


    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };


  // Column definitions with sorting
  const columns = [
    {
      header: "First Name",
      accessorKey: "first_name",
    },
    {
      header: "Last Name",
      accessorKey: "last_name",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },


    {
      header: "Actions",
      cell: ({ row }) => (

        <Box component={'div'} variant="contained" color="primary" sx={{ cursor: 'pointer' }} >
          <IconButton onClick={() => { navigate(`/user-detail/${row?.original?._id}`) }}>
            <NorthEastIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      ),
    },

  ]
  const handleSelectionChange = (selected) => {
    console.log(selected);

    setSelectedRows(selected);

  };
  const SendNotification = async () => {
    setLoader(true);
    const idsArray = selectedRows?.map(item => item._id);
    try {
        let obj = {
            name: getValues2('title'),
            content: getValues2('content'),
            type:type?.id,
            user_ids:idsArray

          
        };
        console.log(idsArray);

        const promise = ApiServices.SendNotifications(obj);

        // Handle the API response properly
        const response = await promise;
        console.log(response);

        showPromiseToast(
            promise,
            "Saving...",
            "Added Successfully",
            "Something Went Wrong"
        );
        if (response?.responseCode === 200) {
          setNotificationDialog(false)
          reset()
          setType(null)
          setSelectedRows([])
      }
        

    } catch (error) {
        console.log(error);
    } finally {
        setLoader(false);
    }
};


  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <SimpleDialog
        open={notificationDialog}
        onClose={() => setNotificationDialog(false)}
        title={'Send Notification?'}
      >
        <Box component="form" onSubmit={handleSubmit2(SendNotification)}>
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
            <Grid item xs={12} sm={12} mt={2}>
              <InputField
                label={"Content :"}
                size={'small'}
                rows={5}
                multiline={true}
                placeholder={"Content"}
                error={errors2?.content?.message}
                register={register2("content", {
                  required:
                    'content is required'

                })}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <SelectField
                size={'small'}
                label={'Type :'}

                options={[{ id: 'Promotion', name: 'Promotion' }, { id: 'Alert', name: 'Alert' }, { id: 'Reminder', name: 'Reminder' }, { id: 'Health', name: 'Health' }, { id: 'Tip', name: 'Tip' }, { id: 'Suggestion', name: 'Suggestion' }, { id: 'Event', name: 'Event' }]}
                selected={type}
                onSelect={(value) => {
                  setType(value)


                }}
                error={errors2?.type?.message}
                register={register2("type", {
                  required: 'Please select type.',
                })}
              />
            </Grid>


            
            <Grid container sx={{ justifyContent: 'center' }}>
              <Grid item xs={6} sm={6} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: '25px' }}>
                <PrimaryButton bgcolor={'black'} title="Yes,Confirm" type="submit" />
                <PrimaryButton onClick={() => { setNotificationDialog(false) }} bgcolor={'#FF1F25'} title="No,Cancel" />
              </Grid>
            </Grid>

          </Grid>
        </Box>
      </SimpleDialog>
      <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>


          <Typography variant="h4" sx={{ mb: 4, fontWeight: 500 }}>
            Users
          </Typography>
          <PrimaryButton onClick={() => setNotificationDialog(true)} loader={loader} disabled={loader}type={'submit'} title={selectedRows?.length == 0 ? "Send Notification To All" : "Send Notification To Selected Users"} />
        </Box>
        {data?.length > 0 && <DataTable enableCheckbox={true} onSelectionChange={handleSelectionChange} data={data} columns={columns} />}

      </Paper>
    </div>
  )
}

export default Users
