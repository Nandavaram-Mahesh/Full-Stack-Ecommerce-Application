import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options)=>{

   const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'F2C Store',
            link: 'https://google.com'
            // Optional product logo
            // logo: 'https://mailgen.js/img/logo.png'
        }
    });

    // Generate an HTML email with the provided contents

    let emailHtml = mailGenerator.generate(options.mailgenContent);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)

    let emailText = mailGenerator.generatePlaintext(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT ,
        secure: false,
        auth: {
          user:process.env.MAILTRAP_SMTP_USER,
          pass:process.env.MAILTRAP_SMTP_PASS,
        },

    })

    const mail = {
        from: "mahesh.nandavaram96@gmail.com", // We can name this anything. The mail will go to your Mailtrap inbox
        to: options.email, // receiver's mail
        subject: options.subject, // mail subject
        text: emailText, // mailgen content textual variant
        html: emailHtml, // mailgen content html variant
    };
    
    try{
        const info = await transporter.sendMail(mail)
        console.log(`Email sent: ${info.response}`) 
    }
    catch(error){
        console.log("Something Went wrong while sending mail",error)
    }
    
}


const emailVerificationMailgenContent = (userName,emailVerificationLink)=> {

    return {
        body: {
            name: userName,
            intro: "Welcome to our app! We're very excited to have you on board.",
            action: {
                instructions: "To verify your email please click on the following button:",
                button: {
                    color: "#22BC66", // Optional action button color
                    text: "Verify your email",
                    link: emailVerificationLink
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
}

export {emailVerificationMailgenContent,sendEmail}