import nodemailer from 'nodemailer'
class MailService {
    constructor() {
        this.transporter=nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
async sendActivationMail(to,name,activationLink){
await this.transporter.sendMail({
    from:process.env.SMTP_USER,
    to,
    subject:`Activation account on ${process.env.API_URL} `,
    text:"",
    html:`
    <div>
        <h1>Hello, ${name}. For activation click on the link</h1>
        <a href="${activationLink}">${activationLink}</a>
    </div>
    `
})
}
}
export default  MailService
