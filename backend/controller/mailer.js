import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import ENV from '../config.js'

let nodeConfig={
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: ENV.EMAIL, // generated ethereal user
    pass: ENV.PASSWORD, // generated ethereal password
  },
}

let transporter = nodemailer.createTransport(nodeConfig)

let MailGenerator = new Mailgen({
  theme: "default",
  product : {
    name: "Mailgen",
    link: 'https://mailgen.js/'
  }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/

export const registerMail = async (req,res)=>{

  const {username,userEmail,text,subject} = req.body

  // body of the email
  let email = {
    body:{
      name:username,
      intro: text || "welcome to Something",
      outro: "if u need help fix it by urself"
    }
  }
  let emailBody = MailGenerator.generate(email)

  let message = {
    from:ENV.EMAIL,
    to:userEmail,
    subject:subject || "Signup Successful",
    html:emailBody
  }
  // send mail
  transporter.sendMail(message)
    .then(() => {
      return res.status(200).send({ msg: "You should receive an email from us."})
    })
    .catch(error => res.status(500).send({ error }))
}

// export const registerMail = async (req, res) => {
//   try {
//     const { username, userEmail, text, subject } = req.body;

//     // body of the email
//     let email = {
//       body: {
//         name: username,
//         intro: text || "Welcome to Something",
//         outro: "If you need help, fix it by yourself."
//       }
//     };

//     let message = {
//       from: ENV.EMAIL,
//       to: userEmail,
//       subject: subject || "Signup Successful",
//       html: MailGenerator.generate(email)
//     };

//     // send mail
//     await transporter.sendMail(message);

//     return res.status(200).send({ msg: "You should receive an email from us." });
//   } catch (error) {
//     return res.status(500).send({ error: "Internal Server Error" });
//   }
// };