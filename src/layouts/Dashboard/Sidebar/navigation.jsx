import { lazy } from "react"
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import MapIcon from '@mui/icons-material/Map';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WorkIcon from '@mui/icons-material/Work';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleIcon from "@mui/icons-material/People"
import PersonIcon from "@mui/icons-material/Person"
import PersonOffIcon from "@mui/icons-material/PersonOff"
import ArticleIcon from "@mui/icons-material/Article"


const Appointments = lazy(() => import("../Pages/Appoinments"))
const AppointmentsQuestions = lazy(() => import("../Pages/AppointmentQuestions"))
const Users = lazy(() => import("../Pages/Users"))
const Jobs = lazy(() => import("../Pages/Jobs"))
const Faqs = lazy(() => import("../Pages/Faqs"))
const Places = lazy(() => import("../Pages/Places"))
const Events = lazy(() => import("../Pages/Events"))
const Doctors = lazy(() => import("../Pages/Doctors"))
const Dashboard = lazy(() => import("../Pages/Dashboard"))
const Settings = lazy(() => import("../Pages/Settings"))
const BlockSlots = lazy(() => import("../Pages/BlockSlots"))
const ChatPage = lazy(() => import("../Pages/Chat"))
const Topics = lazy(() => import("../Pages/Topics"))
const Posts = lazy(() => import("../Pages/Posts"))
const Blogs = lazy(() => import("../Pages/Blogs"))
const Staffs = lazy(() => import("../Pages/Staffs"))
const DeletedPatients = lazy(() => import("../Pages/DeletedPatients"))
const AfterCareDocuments = lazy(() => import("../Pages/AfterCareDocuments"))

const Navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: Dashboard,
    icon: <DashboardIcon sx={{ fontSize: "22px" }} />,
  },
  {
    name: "Staff",
    path: "/staff",
    component: Staffs,
    icon: <PeopleIcon sx={{ fontSize: "22px" }} />,
  },

  {
    name: "Patients",
    path: "/patients",
    component: "",
    icon: <PersonIcon sx={{ fontSize: "22px" }} />,
    child: [
      {
        name: "Deleted Patients",
        path: "/deleted-patients",
        component: DeletedPatients,
        icon: <PersonOffIcon sx={{ fontSize: "22px" }} />,
      },
    ],
  },

  {
    name: "Aftercare Documents",
    path: "/aftercare-documents",
    component: AfterCareDocuments,
    icon: <ArticleIcon sx={{ fontSize: "22px" }} />,
  },
]


export default Navigation

