const db = require("../models/index")

let createSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {

                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })

                resolve({
                    errCode: 0,
                    errMessange: "Ok"
                })
            }

        } catch (error) {
            reject(error)
        }
    })

}

let getAllspecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Specialty.findAll({
                attributes: {
                    exclude: ['descriptionMarkdown', 'descriptionHTML']

                },
            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                    return item;
                })


            }
            resolve({
                errCode: 0,
                errMessange: "ok",
                data: data
            })
        }

        catch (error) {
            reject(error)
        }
    })

}
let getDetailSpecialtyService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        // console.log("check input ", inputId, "dsg", location);

        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                });
                if (data) {
                    //do something
                    let doctorSpecialty = []

                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']

                        })
                    }

                    data.doctorSpecialty = doctorSpecialty
                } else data = {}

                resolve({
                    errCode: 0,
                    errMessange: "ok",
                    data: data
                })

            }


        }

        catch (error) {
            reject(error)
        }
    })

}


module.exports = {
    createSpecialtyService: createSpecialtyService,
    getAllspecialtyService: getAllspecialtyService,
    getDetailSpecialtyService: getDetailSpecialtyService
}