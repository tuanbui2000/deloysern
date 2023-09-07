import db from "../models/index"




let createHandbookService = (data) => {
    return new Promise(async (resolve, reject) => {

        try {

            if (!data || !data.name || !data.hanbookContentHTML || !data.hanbookContentMarkdown || !data.imageBase64) {
                reject({
                    errcode: 1,
                    errMessage: "Missing required parameters"
                })
            } else {
                await db.Handbook.create({
                    name: data.name,
                    hanbookContentHTML: data.hanbookContentHTML,
                    hanbookContentMarkdown: data.hanbookContentMarkdown,
                    image: data.imageBase64
                })
                resolve({
                    errCode: 0,
                    errMessage: "Save handbook succeed!!!"
                })

            }


        } catch (error) {
            reject(error)
        }





    })
}

let getAllHandbookService = () => {
    return new Promise(async (resolve, reject) => {

        try {
            let data = await db.Handbook.findAll({
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

        } catch (error) {
            reject(error)
        }



    })
}
let getDetailHandbookService = (id) => {
    return new Promise(async (resolve, reject) => {

        try {

            if (!id) {
                reject({
                    errcode: 1,
                    errMessage: "Missing required parameters"
                })
            } else {
                let data = await db.Handbook.findOne({
                    where: { id: id }
                })
                if (data && data.image) {

                    data.image = Buffer.from(data.image, 'base64').toString('binary')

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    errMessage: "get handbook succeed!!!",
                    data: data
                })

            }


        } catch (error) {
            reject(error)
        }





    })
}

module.exports = {
    createHandbookService: createHandbookService,
    getDetailHandbookService: getDetailHandbookService,
    getAllHandbookService: getAllHandbookService,
}