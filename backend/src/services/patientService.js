import db from "../models/index"
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';




let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`


    return result;
}





let BookingAppointmmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.selectedGenders || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendSimplemail(
                    {
                        receiversEmail: data.email,
                        patientName: data.fullName,
                        doctorName: data.doctorName,
                        time: data.timeString,
                        language: data.language,
                        redirectLink: buildUrlEmail(data.doctorId, token)
                    }
                )




                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleid: "R3",
                        gender: data.selectedGenders,
                        address: data.address,
                        firstName: data.fullName
                    }
                })

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {

                            StatusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }

                    })




                }
                resolve({
                    errCode: 0,
                    errMessage: "appointment succeed!",
                    // data: user
                })
            }
        } catch (error) {
            reject(error);
        }



        resolve({
            errCode: 0,
            data: data
        })
    }
    )
}





let verifyBookingService = (data) => {
    return new Promise(async (resolve, reject) => {


        try {

            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {




                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        StatusId: 'S1'
                    },
                    raw: false
                })


                if (appointment) {
                    appointment.StatusId = 'S2';
                    await appointment.save()


                    console.log(" check appointment", appointment);
                    resolve({
                        errCode: 0,
                        errMessage: " Update the appointment succeed!"
                    })
                } else[
                    resolve({
                        errCode: 2,
                        errMessage: " Appointment has been activated or does not exist "
                    })
                ]

            }





        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    BookingAppointmmentService,
    verifyBookingService
}