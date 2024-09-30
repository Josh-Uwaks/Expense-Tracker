import {Resend} from 'resend'


const resend = new Resend(process.env.RESEND_API_KEY)

export const sendTwoFactorMail = async(
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p>Your 2FA Code: ${token}</p>`
    })
}

export const sendPasswordResetMail = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-passwordReset?token=${token}`


    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            html: `<p>Click <a href=${confirmLink}>here</a> to reset password</p>`
        })
    } catch (error) {
        console.log(error)
    }
}


export const sendVerificationMail = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`


    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your mail",
            html: `<p>Click <a href=${confirmLink}>here</a> to confirm email</p>`
        })
    } catch (error) {
        console.log(error)
    }
    
}