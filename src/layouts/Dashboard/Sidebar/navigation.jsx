import { lazy } from "react"
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArticleIcon from "@mui/icons-material/Article";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AssignmentIcon from "@mui/icons-material/Assignment";



const Dashboard = lazy(() => import("../Pages/Dashboard"))

const Staffs = lazy(() => import("../Pages/Staffs"))
const DeletedPatients = lazy(() => import("../Pages/DeletedPatients"))
const AfterCareDocuments = lazy(() => import("../Pages/AfterCareDocuments"))
const CreateForm = lazy(() => import("../Pages/CreateConsentForm"))
const ConsentForms = lazy(() => import("../Pages/ConsentForms"))
const CompletedForms = lazy(() => import("../Pages/CompletedForms"))
const Navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: Dashboard,
    icon: <DashboardIcon sx={{ fontSize: "22px" }} />,
  },
 
  {
    name: "Patient Directory",
    path: "/patients",
    component: "",
    icon: <PersonIcon sx={{ fontSize: "22px" }} />,
    child: [
      {
        name: "Directory",
        path: "/patients",

        icon: <PersonIcon sx={{ fontSize: "22px" }} />,
      },
      {
        name: "Deleted Patients",
        path: "/deleted-patients",
        component: DeletedPatients,
        icon: <PersonOffIcon sx={{ fontSize: "22px" }} />,
      },
    ],
    
  },
  {
    name: "Forms",
    path: "/consent-forms",
    component: "",
    icon: <DescriptionIcon sx={{ fontSize: "22px" }} />, // Generic form-related icon
    child: [
      {
        name: "Create Consent Form",
        path: "/create-consent-form",
        component: CreateForm,
        icon: <AssignmentIcon sx={{ fontSize: "22px" }} />, // Form creation icon
      },
      {
        name: "Consent Forms",
        path: "/consent-forms",
        component: ConsentForms,
        icon: <FormatListBulletedIcon sx={{ fontSize: "22px" }} />, // List icon for forms
      },
      {
        name: "Completed Forms",
        path: "/completed-forms",
        component: CompletedForms,
        icon: <AssignmentTurnedInIcon sx={{ fontSize: "22px" }} />, // Completed forms icon
      },
    ],
  },
  {
    name: "Aftercare Documents",
    path: "/aftercare-documents",
    component: AfterCareDocuments,
    icon: <ArticleIcon sx={{ fontSize: "22px" }} />, // Document-related icon
  },
  {
    name: "Staffs",
    path: "/staff",
    component: Staffs,
    icon: <PeopleIcon sx={{ fontSize: "22px" }} />,
  },
  {
    name: "Our Profile",
    path: "/profile",

    icon: <PersonIcon sx={{ fontSize: "22px" }} />,
  },
];

export default Navigation; 

