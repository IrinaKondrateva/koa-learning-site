const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports.sendEmail = ({ name, email, message }) => new Promise((resolve, reject) => {
  try {
    if (!name || !email || !message) {
      return resolve({success: false, message: 'Все поля нужно заполнить!'});
    }
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message.trim() + `\n Отправлено с: <${email}>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return resolve({success: false, message: `При отправке письма произошла ошибка!: ${err}`});
      }
      resolve({success: true, message: 'Письмо успешно отправлено!'});
    });
  } catch (err) {
    reject(err);
  }
});
