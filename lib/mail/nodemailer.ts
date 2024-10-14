import nodemailer from 'nodemailer'


const sendCustomMail = async (subject: string, message: string, sent_from: string, sent_to: string, replyTo: string) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string, // Ensure host is a string
      port: Number(process.env.SMTP_PORT) || 587, // Convert port to a number
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
      },
      tls: {
          rejectUnauthorized: false
      },
      // connectionTimeout: 15000, // 15 seconds
      // greetingTimeout: 15000,   // 15 seconds
    })
    
    const mailOptions = {
      from: sent_from,
      to: sent_to,
      replyTo: replyTo,
      subject: subject,
      html: message
    }
    
    transporter.sendMail(mailOptions, (err, res) => {
      if(err){
          console.log(err)
      }else {
          console.log(res)
      }
    })
    
    }
    
    export default sendCustomMail
    