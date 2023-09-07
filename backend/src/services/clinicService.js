const db = require("../models/index")

let createClinicService = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {

                await db.Clinics.create({
                    name: data.name,
                    address: data.address,
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

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.Clinics.findAll({
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
let getDetailClinicService = (inputId) => {
    return new Promise(async (resolve, reject) => {


        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.Clinics.findOne({
                    where: { id: inputId },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                });
                if (data) {
                    //do something
                    let doctorClinic = []


                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { ClinicId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                    data.doctorClinic = doctorClinic;

                    resolve({
                        errCode: 0,
                        errMessange: "ok",
                        data: data
                    })

                }


            }
        } catch (error) {
            reject(error)
        }
    })

}


module.exports = {
    createClinicService: createClinicService,
    getAllClinicService: getAllClinicService,
    getDetailClinicService: getDetailClinicService
}