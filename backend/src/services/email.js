const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Generate test SMTP service account from ethereal.email
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    const mailOptions = {
        from: 'Notables App <noreply@notables.test>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!process.env.SMTP_HOST) {
        console.log('Test email sent: %s', nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
