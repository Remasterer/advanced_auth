import nodemailer from 'nodemailer';

export const sendActivationEmail = async (receiverEmail, activationLink) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    await transport.sendMail({
        from: process.env.SMTP_EMAIL,
        to: receiverEmail,
        subject: `User activation for ${process.env.APP_URL}`,
        text: '',
        html: `<div>
            <h3>For user account activation click link belowe</h3>
            <a href="${activationLink}">Click here</a>
        </div>`
    });
}
