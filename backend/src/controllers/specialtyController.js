import specialtyService from "../services/specialtyService.js"



let createSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialtyService(req.body)

        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}
let getAllspecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllspecialtyService()

        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server"
        })
    }
}
let getDetailSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialtyService(req.query.id, req.query.location)

        
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
    createSpecialty: createSpecialty,
    getAllspecialty: getAllspecialty,
    getDetailSpecialty:getDetailSpecialty
}