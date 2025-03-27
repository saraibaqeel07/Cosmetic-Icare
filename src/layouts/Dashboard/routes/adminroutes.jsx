import { lazy } from "react"
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';

const CreatePlace = lazy(() => import("../Pages/CreatePlace"))
const CreateDoctor = lazy(() => import("../Pages/CreateDoctor"))
const CreateQuestion = lazy(() => import("../Pages/CreateQuestions"))
const CreateJob = lazy(() => import("../Pages/CreateJob"))
const CreateFaq = lazy(() => import("../Pages/CreateFaq"))
const CreateEvent = lazy(() => import("../Pages/CreateEvent"))
const UpdateEvent = lazy(() => import("../Pages/UpdateEvent"))
const UpdateJob = lazy(() => import("../Pages/UpdateJob"))
const UpdateDoctor = lazy(() => import("../Pages/UpdateDoctor"))
const UpdatePlace = lazy(() => import("../Pages/UpdatePlaces"))
const Appointments = lazy(() => import("../Pages/Appoinments"))
const AppointmentsQuestions = lazy(() => import("../Pages/AppointmentQuestions"))
const Users = lazy(() => import("../Pages/Users"))
const Jobs = lazy(() => import("../Pages/Jobs"))
const Faqs = lazy(() => import("../Pages/Faqs"))
const Places = lazy(() => import("../Pages/Places"))
const Staffs = lazy(() => import("../Pages/Staffs"))
const Events = lazy(() => import("../Pages/Events"))
const Doctors = lazy(() => import("../Pages/Doctors"))
const Dashboard = lazy(() => import("../Pages/Dashboard"))
const Profile = lazy(() => import("../Pages/Profile"))
const Settings = lazy(() => import("../Pages/Settings"))
const BlockSlots = lazy(() => import("../Pages/BlockSlots"))
const UserDetail = lazy(() => import("../Pages/UserDetail"))
const ChatPage = lazy(() => import("../Pages/Chat"))
const AppointmentDetail = lazy(() => import("../Pages/AppointmentDetail"))
const Topics = lazy(() => import("../Pages/Topics"))
const Posts = lazy(() => import("../Pages/Posts"))
const CreatePost = lazy(() => import("../Pages/CreatePost"))
const UpdatePost = lazy(() => import("../Pages/UpdatePost"))
const Blogs = lazy(() => import("../Pages/Blogs"))
const CreateBlog = lazy(() => import("../Pages/CreateBlog"))
const UpdateBlog = lazy(() => import("../Pages/UpdateBlog"))
const CreateStaff = lazy(() => import("../Pages/CreateStaff"))
const UpdateStaff = lazy(() => import("../Pages/UpdateStaff"))
const Patients = lazy(() => import("../Pages/Patients"))
const CreatePatient = lazy(() => import("../Pages/CreatePatient"))
const UpdatePatient = lazy(() => import("../Pages/UpdatePatient"))
const PatientDetail = lazy(() => import("../Pages/PatientDetail"))
const DeletedPatients = lazy(() => import("../Pages/DeletedPatients"))
const CreateAfterDocument = lazy(() => import("../Pages/CreateAfterCareDocument"))
const AfterCareDocuments = lazy(() => import("../Pages/AfterCareDocuments"))
const UpdateAfterCareDocument = lazy(() => import("../Pages/UpdateAfterCareDocument"))
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
    name: "Appointment",
    path: "/appointments",
    component: Appointments,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Appointment Questions",
    path: "/appointments-questions",
    component: AppointmentsQuestions,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Users",
    path: "/users",
    component: Users,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Places",
    path: "/places",
    component: Places,
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
    name: "Create Place",
    path: "/create-place",
    component: CreatePlace,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Place",
    path: "/update-place",
    component: UpdatePlace,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Profile",
    path: "/profile",
    component: Profile,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Doctors",
    path: "/doctors",
    component: Doctors,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Doctor",
    path: "/create-doctor",
    component: CreateDoctor,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Doctor",
    path: "/update-doctor",
    component: UpdateDoctor,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Jobs",
    path: "/jobs",
    component: Jobs,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Job",
    path: "/create-job",
    component: CreateJob,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Job",
    path: "/update-job",
    component: UpdateJob,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "FAQ's",
    path: "/faqs",
    component: Faqs,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Faq",
    path: "/create-faq",
    component: CreateFaq,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Events",
    path: "/events",
    component: Events,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Event",
    path: "/create-event",
    component: CreateEvent,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Event",
    path: "/update-event",
    component: UpdateEvent,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Settings",
    path: "/settings",
    component: Settings,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Block Slots",
    path: "/block-slots",
    component: BlockSlots,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "User Detail",
    path: "/user-detail/:id",
    component: UserDetail,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Chat",
    path: "/chat",
    component: ChatPage,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Question",
    path: "/create-question",
    component: CreateQuestion,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Appointment Detail",
    path: "/appointment-detail/:id",
    component: AppointmentDetail,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Topics",
    path: "/topics",
    component: Topics,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Posts",
    path: "/posts",
    component: Posts,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Post",
    path: "/create-post",
  component: CreatePost,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Post",
    path: "/update-post/:id",
    component: UpdatePost,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Blogs",
    path: "/blogs",
    component: Blogs,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Create Blog",
    path: "/create-blog",
    component: CreateBlog,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
  {
    name: "Update Blog",
    path: "/update-blog/:id",
    component: UpdateBlog,
    icon:<ReceiptIcon sx={{fontSize:'22px'}} />
  },
]

export default adminRoutes

