const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    // service: "hotmail",
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: process.env.USE_MAIL,
        pass: process.env.MAIL_PASS
    },
    from: process.env.USE_MAIL
});

/* const transport = nodemailer.createTransport({
    sendmail: true,
    host: "ns1113.papaki.gr",
    port: 587,
    secure:false,
    auth: {
        user: process.env.USE_MAIL,
        pass: process.env.MAIL_PASS
    }
}); */

module.exports = transport

