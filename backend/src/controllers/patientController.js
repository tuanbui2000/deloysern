import patientService from "../services/patientService.js"


let patientBookingAppointmment = async (req, res) => {
    console.log('ccheck sml ',req.body);
    try {
        let response = await patientService.BookingAppointmmentService(req.body)

        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}
let verifypatientBookingAppointmment =async (req, res) => {
    try {
        let response = await patientService.verifyBookingService(req.body)
     

        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}




module.exports = {
    patientBookingAppointmment: patientBookingAppointmment,
    verifypatientBookingAppointmment:verifypatientBookingAppointmment
}