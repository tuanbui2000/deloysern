import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController.js"
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController.js";
import handbookController from "../controllers/handbookController.js";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);

    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    //api
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUser);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopdoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);

    router.post('/api/save-info-doctors', doctorController.postInfoDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatient);
    
    router.post('/api/patient-book-appointment', patientController.patientBookingAppointmment);
    router.post('/api/verify-book-appointment', patientController.verifypatientBookingAppointmment);


    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-all-specialty', specialtyController.getAllspecialty);
    router.get('/api/get-detail-specialty', specialtyController.getDetailSpecialty);

    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-all-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic', clinicController.getDetailClinic);
    
    router.post('/api/create-new-handbook', handbookController.createHandbook);
    router.get('/api/get-all-handbook', handbookController.getAllHandbook);
    router.get('/api/get-detail-handbook', handbookController.getDetailHandbook);
    
    router.post('/api/send-remedy', doctorController.sendRemedy);


    return app.use("/", router);
}

module.exports = initWebRoutes;