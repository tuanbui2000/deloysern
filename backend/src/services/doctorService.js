import db from "../models/index"
import _ from "lodash"
require('dotenv').config()
import emailService from "./emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopdoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleid: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true

            })
            resolve({
                errCode: 0,
                data: users,
                message: '0K'
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAlldoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({

                where: { roleid: 'R2' },
                // order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password', 'image']
                },
                // raw: true,
                // nest: true

            })
            resolve({
                errCode: 0,
                data: doctors,
            })
        } catch (error) {
            reject(error)
        }
    })
}

let checkRequiredFields = (inputdata) => {
    let arrFields = ["doctorId", "contentHTML", "contentMarkdown", "selectedPrice", "selectedPayment", "action", "selectedProvince", "nameClinic", "addressClinic", "note", "note", "specialtyId"]
    let isVailed = true
    let element = ''
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputdata[arrFields[i]]) {
            isVailed = false;
            element = arrFields[i]
            break;
        }
    }
    return {
        isVailed: isVailed,
        element: element
    }
}

let saveDetailInfoDoctors = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isVailed === false) {
                resolve({
                    errCode: 1,
                    errMessange: `missing required parameters: ${checkObj.element}`
                })
            } else {

                //upsert to markdown
                if (inputData.action === 'ADD') {
                    await db.Markdown.create({

                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId


                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        doctorMarkdown.doctorId = inputData.doctorId;;
                        doctorMarkdown.updateAt = new Date();

                        await doctorMarkdown.save()
                    }
                }

            }

            //upsert to doctor-info
            let doctorInfo = await db.Doctor_Infor.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            })

            if (doctorInfo) {
                //update
                doctorInfo.doctorId = inputData.doctorId;
                doctorInfo.priceId = inputData.selectedPrice;
                doctorInfo.provinceId = inputData.selectedProvince;
                doctorInfo.paymentId = inputData.selectedPayment;
                doctorInfo.addressClinic = inputData.addressClinic;;
                doctorInfo.nameClinic = inputData.nameClinic;;
                doctorInfo.note = inputData.note;
                doctorInfo.specialtyId = inputData.specialtyId;
                doctorInfo.clinicId = inputData.clinicId;

                await doctorInfo.save()

            } else {
                //create
                await db.Doctor_Infor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPrice,
                    provinceId: inputData.selectedProvince,
                    paymentId: inputData.selectedPayment,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note,
                    specialtyId: inputData.specialtyId,
                    clinicId: inputData.clinicId,
                })
            }



            resolve({
                errCode: 0,
                errMessange: "save info doctor succeed!",
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorByIdService = (userId) => {

    // console.log(userId);
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password']
                    },

                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']

                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId']

                            },

                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true

                })


                if (data && data.image) {

                    data.image = Buffer.from(data.image, 'base64').toString('binary')

                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}


let bulkCreateScheduleService = (data) => {

    // console.log(userId);
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item
                    })
                }
                //fetch
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })
                //convert

                // check difference
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })

                //insert to database
                if (toCreate && toCreate.length > 0) {

                    // console.log("check before bulk create ");
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessange: "save schedule succeed!",
                })
            }
        }

        catch (error) {
            reject(error)
        }
    })
}



let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },

                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {

                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getExtraInfoDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId,

                    },
                    attributes: {
                        exclude: ['id', 'doctorId']

                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) {

                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getProfileDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,

                    },
                    attributes: {
                        exclude: ['password']

                    },
                    include: [{
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown']

                    },
                    {
                        model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                        ]
                    },
                    ],
                    raw: false,
                    nest: true


                })
                if (data && data.image) {

                    data.image = Buffer.from(data.image, 'base64').toString('binary')

                }


                if (!data) {

                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getListPatientService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        StatusId: 'S2',
                        date: date

                    },

                    include: [
                        {
                            model: db.User, as: 'patientData',
                            attributes: ['email', 'firstName', 'address',],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                        { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] },

                    ],
                    raw: false,
                    nest: true


                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let sendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.email || !data.doctorId || !data.patientId || !data.timeType || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessange: "missing required parameters"
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        StatusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.StatusId = 'S3'
                    await appointment.save()
                }


                //send email remedy

                await emailService.sendAttatchment(data)


                resolve({
                    errCode: 0,
                    errMessange: "oke"
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}






module.exports = {
    getTopdoctorHome: getTopdoctorHome,
    getAlldoctors: getAlldoctors,
    saveDetailInfoDoctors: saveDetailInfoDoctors,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraInfoDoctorByIdService: getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService: getProfileDoctorByIdService,
    getListPatientService: getListPatientService,
    sendRemedyService: sendRemedyService
}