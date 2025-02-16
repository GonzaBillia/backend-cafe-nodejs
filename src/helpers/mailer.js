import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

export default transporter