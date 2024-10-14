import {Resend} from 'resend'
import sendCustomMail from './nodemailer'


const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXTAPP_PUBLIC_URL

export const sendTwoFactorMail = async(
    email: string,
    token: string
) => {
    // await resend.emails.send({
    //     from: "onboarding@resend.dev",
    //     to: email,
    //     subject: "2FA Code",
    //     html: `<p>Your 2FA Code: ${token}</p>`
    // })

    const subject = '2FA Code'
    const message =  `<p>Your 2FA Code <b style={{fontWeight: bolder}}>${token}</b>.</p>`
    const sent_to = email
    const sent_from = process.env.SMTP_USER
    const replyTo = email

    if(sent_from && sent_to) {
        await sendCustomMail(subject, message, sent_from, sent_to, replyTo)
    }

}

export const sendPasswordResetMail = async (
    email: string,
    token: string
) => {

    const confirmLink = `${domain}/auth/new-password?token=${token}`

    try {
        // await resend.emails.send({
        //     from: "onboarding@resend.dev",
        //     to: email,
        //     subject: "Reset your password",
        //     html: `<p>Click <a href=${confirmLink}>here</a> to reset password</p>`
        // })

        const subject = 'Reset Your Password'
        const message =  `<p>Click <a href=${confirmLink}>here</a> to reset password.</p>`
        const sent_to = email
        const sent_from = process.env.SMTP_USER
        const replyTo = email

    if(sent_from && sent_to) {
        await sendCustomMail(subject, message, sent_from, sent_to, replyTo)
    }

    } catch (error) {
        console.log(error)
    }
}


export const sendVerificationMail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    try {
        // await resend.emails.send({
        //     from: "onboarding@resend.dev",
        //     to: email,
        //     subject: "Verify your mail",
        //     html: `<p>Click <a href=${confirmLink}>here</a> to confirm email</p>`
        // })

        const subject = 'Verify Your Mail'
        const message =  `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`
        const sent_to = email
        const sent_from = process.env.SMTP_USER
        const replyTo = email

    if(sent_from && sent_to) {
        await sendCustomMail(subject, message, sent_from, sent_to, replyTo)
    }
    } catch (error) {
        console.log(error)
    }
    
}