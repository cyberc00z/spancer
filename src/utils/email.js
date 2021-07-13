import nodemailer from 'nodemailer';
import dotenv from "dotenv";

const { MAIL_SERVICE, MAIL_USER, MAIL_PASS } = process.env;

/**
 * Create a transporter object that will help use to send mails
*/

const transport = nodemailer.createTransport({
    // host: '192.168.43.244' ,
    // port:25,
    // tls: {
    //     rejectUnauthorized: false
    // },
    // auth: {
    //     user: MAIL_USER,
    //     pass: MAIL_PASS,
    // },
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "fb64b16c969367",
          pass: "e8fcb9f66311fe"
        }
});


/**
 * Sends an email to User
 *
 * @param {string} to email address where to send mail
 * @param {string} subject of the email
 * @param {string} html content for email 
 */

export const sendEmail = ({ to, subject, html }) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {from: MAIL_USER, to, subject, html};
        return transport.sendMail(mailOptions)
                         .then((res) => {
                             resolve(res.data);
                         })
                         .catch((err) => {
                             reject(err);
                         });
    });
}