import clinicService from "../services/clinicService";



let createClinic = async (req, res) => {
    try {
        let response = await clinicService.createClinicService(req.body)

        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinicService()

        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}
let getDetailClinic = async (req, res) => {
    try {
        let response = await clinicService.getDetailClinicService(req.query.id)

        
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
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinic:getDetailClinic
}