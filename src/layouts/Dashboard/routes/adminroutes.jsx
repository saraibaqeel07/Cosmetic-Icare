import { lazy } from "react"
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';


const Users = lazy(() => import("../Pages/Users"))

const Staffs = lazy(() => import("../Pages/Staffs"))

const Dashboard = lazy(() => import("../Pages/Dashboard"))
const Profile = lazy(() => import("../Pages/Profile"))

const UpdateStaff = lazy(() => import("../Pages/UpdateStaff"))
const Patients = lazy(() => import("../Pages/Patients"))
const CreatePatient = lazy(() => import("../Pages/CreatePatient"))
const UpdatePatient = lazy(() => import("../Pages/UpdatePatient"))
const PatientDetail = lazy(() => import("../Pages/PatientDetail"))
const DeletedPatients = lazy(() => import("../Pages/DeletedPatients"))
const CreateAfterDocument = lazy(() => import("../Pages/CreateAfterCareDocument"))
const AfterCareDocuments = lazy(() => import("../Pages/AfterCareDocuments"))
const UpdateAfterCareDocument = lazy(() => import("../Pages/UpdateAfterCareDocument"))
const CreateForm = lazy(() => import("../Pages/CreateConsentForm"))
const ConsentForms = lazy(() => import("../Pages/ConsentForms"))
const UpdateConsentForm = lazy(() => import("../Pages/UpdateConsentForm"))
const SendForm = lazy(() => import("../Pages/SendForm"))
const CompletedForms = lazy(() => import("../Pages/CompletedForms"))
const CreateStaff = lazy(() => import("../Pages/CreateStaff"))
const adminRoutes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: Dashboard,
    icon:<DashboardIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Staff",
    path: "/staff",
    component: Staffs,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Aftercare Documents",
    path: "/aftercare-documents",
    component: AfterCareDocuments,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Aftercare Document",
    path: "/update-aftercare-document/:id",
    component: UpdateAfterCareDocument,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },

  {
    name: "Users",
    path: "/users",
    component: Users,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  
  {
    name: "Create Consent Form",
    path: "/create-consent-form",
    component: CreateForm,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Consent Forms",
    path: "/consent-forms",
    component: ConsentForms,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Completed Forms",
    path: "/completed-forms",
    component: CompletedForms,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Consent Form",
    path: "/update-consent-form/:id",
    component: UpdateConsentForm,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Send Form",
    path: "/send-form/:id",
    component: SendForm,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Staff",
    path: "/create-staff",
    component: CreateStaff,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Staff",
    path: "/update-staff/:id",
    component: UpdateStaff,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Patients",
    path: "/patients",
    component: Patients,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Deleted Patients",
    path: "/deleted-patients",
    component: DeletedPatients,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Patient",
    path: "/create-patient",
    component: CreatePatient,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Patient",
    path: "/update-patient/:id",
    component: UpdatePatient,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: " Patient Detail",
    path: "/patient-detail/:id",
    component: PatientDetail,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Aftercare Document",
    path: "/create-aftercare-document",
    component: CreateAfterDocument,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },

  {
    name: "Profile",
    path: "/profile",
    component: Profile,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  
 

  
  
 
]

export default adminRoutes

