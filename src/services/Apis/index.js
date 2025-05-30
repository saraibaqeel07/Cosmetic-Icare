import { deleted, get, patch, post } from '../../services/';
import routes from './routes';

const ApiServices = {
    CreatePlace: async (obj) => {
        const data = await post(routes.CreatePlace, obj);
        return data;
    },
    CreateFormTemplate: async (obj) => {
        const data = await post(routes.CreateFormTemplate, obj);
        return data;
    },
    CompleteForm: async (obj) => {
        const data = await post(routes.CompleteForm, obj);
        return data;
    },
    CreateStaff: async (obj) => {
        const data = await post(routes.CreateStaff, obj);
        return data;
    },
    CreateForm: async (obj) => {
        const data = await post(routes.CreateForm, obj);
        return data;
    },
    CreateAfterDocument: async (obj) => {
        const data = await post(routes.CreateAfterDocument, obj);
        return data;
    },
    CreatePatient: async (obj) => {
        const data = await post(routes.CreatePatient, obj);
        return data;
    },
    CreateDoctor: async (obj) => {
        const data = await post(routes.CreateDoctor, obj);
        return data;
    },
    SendForm: async (obj) => {
        const data = await post(routes.SendForm, obj);
        return data;
    },
    CreateBlog: async (obj) => {
        const data = await post(routes.CreateBlog, obj);
        return data;
    },
    CreatePost: async (obj) => {
        const data = await post(routes.CreatePost, obj);
        return data;
    },
    SendNotifications: async (obj) => {
        const data = await post(routes.SendNotifications, obj);
        return data;
    },
    AddBlockSlots: async (obj) => {
        const data = await post(routes.AddBlockSlots, obj);
        return data;
    },
    CreateQuestion: async (obj) => {
        const data = await post(routes.CreateQuestion, obj);
        return data;
    },
    CreateTopic: async (obj) => {
        const data = await post(routes.CreateTopic, obj);
        return data;
    },
    CreateJob: async (obj) => {
        const data = await post(routes.CreateJob, obj);
        return data;
    },
    CreateFaq: async (obj) => {
        const data = await post(routes.CreateFaq, obj);
        return data;
    },
    CreateEvent: async (obj) => {
        const data = await post(routes.CreateEvent, obj);
        return data;
    },
    UpdateSettings: async (obj) => {
        const data = await post(routes.UpdateSettings, obj);
        return data;
    },
    DeletePlace: async (obj) => {
        const data = await deleted(routes.DeletePlace, obj);
        return data;
    },
    DeleteDoctor: async (obj) => {
        const data = await deleted(routes.DeleteDoctor, obj);
        return data;
    },
    DeleteTopic: async (obj) => {
        const data = await deleted(routes.DeleteTopic, obj);
        return data;
    },
    DeleteFormTemplate: async (obj) => {
        const data = await deleted(routes.DeleteFormTemplate, obj);
        return data;
    },
    DeletePatient: async (obj) => {
        const data = await deleted(routes.DeletePatient, obj);
        return data;
    },
    DeleteQuestion: async (obj) => {
        const data = await deleted(routes.DeleteQuestion, obj);
        return data;
    },
    DeleteEvent: async (obj) => {
        const data = await deleted(routes.DeleteEvent, obj);
        return data;
    },
    DeleteBlockSlot: async (obj) => {
        const data = await deleted(routes.DeleteBlockSlot, obj);
        return data;
    },
    DeleteJob: async (obj) => {
        const data = await deleted(routes.DeleteJob, obj);
        return data;
    },
    DeleteFaq: async (obj) => {
        const data = await deleted(routes.DeleteFaq, obj);
        return data;
    },
    DeleteBlog: async (obj) => {
        const data = await deleted(routes.DeleteBlog, obj);
        return data;
    },
    DeletePost: async (obj) => {
        const data = await deleted(routes.DeletePost, obj);
        return data;
    },
    DeleteForm: async (obj) => {
        const data = await deleted(routes.DeleteForm, obj);
        return data;
    },
    DeleteAfterCareDoc: async (obj) => {
        const data = await deleted(routes.DeleteAfterCareDoc, obj);
        return data;
    },
    UpdatePlace: async (obj) => {
        const data = await patch(routes.UpdatePlace, obj);
        return data;
    },
    UpdateEvent: async (obj) => {
        const data = await patch(routes.UpdateEvent, obj);
        return data;
    },
    UpdateForm: async (obj) => {
        const data = await patch(routes.UpdateForm, obj);
        return data;
    },
    UpdateProfile: async (obj) => {
        const data = await patch(routes.UpdateProfile, obj);
        return data;
    },
    UpdateFormTemplate: async (obj) => {
        const data = await patch(routes.UpdateFormTemplate, obj);
        return data;
    },
    UpdatePatient: async (obj) => {
        const data = await patch(routes.UpdatePatient, obj);
        return data;
    },
    UpdateTopic: async (obj) => {
        const data = await patch(routes.UpdateTopic, obj);
        return data;
    },
    UpdateDoctor: async (obj) => {
        const data = await patch(routes.UpdateDoctor, obj);
        return data;
    },
    UpdateJob: async (obj) => {
        const data = await patch(routes.UpdateJob, obj);
        return data;
    },
    UpdateBlog: async (obj) => {
        const data = await patch(routes.UpdateBlog, obj);
        return data;
    },
    UpdatePost: async (obj) => {
        const data = await patch(routes.UpdatePost, obj);
        return data;
    },
    UpdateAfterCareDocument: async (obj) => {
        const data = await patch(routes.UpdateAfterCareDocument, obj);
        return data;
    },
    UpdateStaff: async (obj) => {
        const data = await patch(routes.UpdateStaff, obj);
        return data;
    },
    SendOtp: async (obj) => {
        const data = await post(routes.SendOtp, obj);
        return data;
    },
    Login: async (obj) => {
        const data = await post(routes.Login, obj);
        return data;
    },
    GetSpecialty: async (obj) => {
        const data = await get(routes.GetSpecialty, obj);
        return data;
    },
    getPostData: async (obj) => {
        const data = await get(routes.getPostData, obj);
        return data;
    },
    getSettings: async (obj) => {
        const data = await get(routes.getSettings, obj);
        return data;
    },
    getBlogData: async (obj) => {
        const data = await get(routes.getBlogData, obj);
        return data;
    },
    getFormTemplateDetail: async (obj) => {
        const data = await get(routes.getFormTemplateDetail, obj);
        return data;
    },
    getFormTemplates: async (obj) => {
        const data = await get(routes.getFormTemplates, obj);
        return data;
    },
    getPosts: async (obj) => {
        const data = await get(routes.getPosts, obj);
        return data;
    },
    getPatients: async (obj) => {
        const data = await get(routes.getPatients, obj);
        return data;
    },
    getAfterCareDocuments: async (obj) => {
        const data = await get(routes.getAfterCareDocuments, obj);
        return data;
    },
    getAppointmentDetail: async (obj) => {
        const data = await get(routes.getAppointmentDetail, obj);
        return data;
    },
    getFormDetail: async (obj) => {
        const data = await get(routes.getFormDetail, obj);
        return data;
    },
    getAfterCareDocumentDetail: async (obj) => {
        const data = await get(routes.getAfterCareDocumentDetail, obj);
        return data;
    },
    GetPatientDetails: async (obj) => {
        const data = await get(routes.GetPatientDetails, obj);
        return data;
    },
    getAppointmentsByUser: async (obj) => {
        const data = await get(routes.getAppointmentsByUser, obj);
        return data;
    },
    getCalendar: async (obj) => {
        const data = await get(routes.getCalendar, obj);
        return data;
    },
    getQuestions: async (obj) => {
        const data = await get(routes.getQuestions, obj);
        return data;
    },
    getAppointments: async (obj) => {
        const data = await get(routes.getAppointments, obj);
        return data;
    },
    getBlogs: async (obj) => {
        const data = await get(routes.getBlogs, obj);
        return data;
    },
    getUserDetail: async (obj) => {
        const data = await get(routes.getUserDetail, obj);
        return data;
    },
    getTopics: async (obj) => {
        const data = await get(routes.getTopics, obj);
        return data;
    },
    getUsers: async (obj) => {
        const data = await get(routes.getUsers, obj);
        return data;
    },
    getBlockSlots: async (obj) => {
        const data = await get(routes.getBlockSlots, obj);
        return data;
    },
    getConsentForms: async (obj) => {
        const data = await get(routes.getConsentForms, obj);
        return data;
    },
    getStats: async (obj) => {
        const data = await get(routes.getStats, obj);
        return data;
    },
    getJobs: async (obj) => {
        const data = await get(routes.getJobs, obj);
        return data;
    },
    getEvents: async (obj) => {
        const data = await get(routes.getEvents, obj);
        return data;
    },
    getFaqs: async (obj) => {
        const data = await get(routes.getFaqs, obj);
        return data;
    },
    geoLocation: async (obj) => {
        const data = await get(routes.geoLocation, obj);
        return data;
    },
    getProfile: async (obj) => {
        const data = await get(routes.getProfile, obj);
        return data;
    },
    getPlaces: async (obj) => {
        const data = await get(routes.getPlaces, obj);
        return data;
    },
    getDoctors: async (obj) => {
        const data = await get(routes.getDoctors, obj);
        return data;
    },
    getLocationDetail: async (obj) => {
        const data = await get(routes.getLocationDetail, obj);
        return data;
    },
    getStaffs: async (obj) => {
        const data = await get(routes.getStaffs, obj);
        return data;
    },

}

export default ApiServices