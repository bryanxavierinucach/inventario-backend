const nodemailer = require('nodemailer');
const db = require('./../../modules/autorization/models/index');
const User = db.user;
module.exports = class EmailService {

    async send(to, subject, html) {
        const transporter = nodemailer.createTransport({
            pool: true,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // use TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });
        // verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        const info = await transporter.sendMail({
            from: '"Divergenti Server" <holadiver@divergenti.cl>', // sender address,
            to,
            subject,
            html,
        })
        console.log('Message sent: %s', info.messageId);
    }

    async sendByUserId(userId, subject, html) {
        const user = await User.findByPk(userId, { attributes: ['email'] });
        if (user)
            await this.send(user.dataValues.email, subject, html);
    }
}