require('dotenv').config();
const nodemailer = require("nodemailer");


let sendSimplemail = async (dataSend) => {


    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,

        }
    });


    // async..await is not allowed in global scope, must use a wrapper

    // send mail with defined transport object
    const info = transporter.sendMail({
        from: '"Tún👻" <tuanbui1589@gmail.com>', // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "ahihi",
        html: getbodyHTMLEmail(dataSend), // html body
    });


}


let getbodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3> Dear ${dataSend.patientName}</h3>
        <p> Bạn nhận được email này vì đã đặt lịch online trên trang web </p>
        <p> Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là chính xác, vui lòng click vào đưòng link  bên dưới để xác nhận và hoàn tất thủ tục</p>
        <div><a href= ${dataSend.redirectLink} target = "_blank"> Click here</a></div>
        <div> Xin chân thành cảm ơn!</div>

        `
    }
    if (dataSend.language === 'en') {
        result = `
        
<h3>Dear ${dataSend.patientName}</h3>
<p>You are receiving this email because you have made an online appointment on our website.</p>
<p>Appointment details:</p>
<div><b>Time: ${dataSend.time}</b></div>
<div><b>Doctor: ${dataSend.doctorName}</b></div>
<p>If the above information is correct, please click on the link below to confirm and complete the appointment process:</p>
<div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
<div>Thank you very much!</div>
        `

    }
    return result
}



let getbodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3> Dear ${dataSend.patientName}</h3>
        <p> Bạn nhận được email này vì đã đặt lịch online trên trang web </p>
        <p> Thông tin đặt lịch khám bệnh:</p>
        
        <div> Xin chân thành cảm ơn!</div>
        
        `
    }
    if (dataSend.language === 'en') {
        result = `
        
<h3>Dear ${dataSend.patientName}</h3>
<p>You are receiving this email because you have made an online appointment on our website.</p>
<p>Appointment details:</p>
<div>Thank you very much!</div>
`

    }
    return result
}

let sendAttatchment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {

        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,

                }
            });


            // async..await is not allowed in global scope, must use a wrapper

            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '"Tún👻" <tuanbui1589@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                html: getbodyHTMLEmailRemedy(dataSend), // html body
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getDate()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'

                    },
                ]
            });
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    sendSimplemail: sendSimplemail,
    sendAttatchment: sendAttatchment,
}