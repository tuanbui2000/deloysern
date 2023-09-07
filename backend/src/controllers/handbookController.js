import handbookService from "../services/handbookService.js"


let createHandbook = async (req, res) => {

    try {
        let info = await handbookService.createHandbookService(req.body)

        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}
let getAllHandbook = async (req, res) => {

    try {
        let info = await handbookService.getAllHandbookService();

        return res.status(200).json(info)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }

}
let getDetailHandbook = async (req, res) => {

    try {
        let info = await handbookService.getDetailHandbookService(req.query.id)

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
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbook:getDetailHandbook
}