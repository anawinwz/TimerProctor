import { createTransport } from 'nodemailer'

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const defaultMailOptions = {
  from: process.env.SMTP_FROM || process.env.SMTP_USER
}

export const sendMail = transporter.sendMail
