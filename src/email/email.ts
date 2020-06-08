import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
});
const mailOptions = {
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: 'Test Email',
  text: 'This is a test email from node'
}

export const ConfirmEmail = (email: string) => {
  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      return console.log(err);
    }
    console.log('Email sent' + data)
  })
}