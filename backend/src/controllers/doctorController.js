import doctorService from "../services/doctorService"






let getTopdoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopdoctorHome(+limit)


        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }

}




let getAllDoctors = async (req, res) => {

    try {
        let doctors = await doctorService.getAlldoctors()
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}
let postInfoDoctors = async (req, res) => {

    try {
        let response = await doctorService.saveDetailInfoDoctors(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}


let getDetailDoctorById = async (req, res) => {

    try {
        let info = await doctorService.getDetailDoctorByIdService(req.query.id)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}

let bulkCreateSchedule = async (req, res) => {

    try {
        let info = await doctorService.bulkCreateScheduleService(req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}
let getListPatient = async (req, res) => {

    try {
        let info = await doctorService.getListPatientService(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}

let getScheduleDoctorByDate = async (req, res) => {

    try {
        let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date)
        // console.log(`check id`, req.query.doctorId, `check date`, req.query.date);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}

let getExtraInfoDoctorById = async (req, res) => {

    try {
        let info = await doctorService.getExtraInfoDoctorByIdService(req.query.doctorId)



        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}

let getProfileDoctorById = async (req, res) => {

    try {
        let info = await doctorService.getProfileDoctorByIdService(req.query.doctorId)



        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}
let sendRemedy = async (req, res) => {

    try {
        let info = await doctorService.sendRemedyService(req.body)



        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}







module.exports = {
    getTopdoctorHome: getTopdoctorHome,
    getAllDoctors: getAllDoctors,
    postInfoDoctors: postInfoDoctors,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatient: getListPatient    ,
    sendRemedy: sendRemedy
}