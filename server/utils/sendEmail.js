import nodemailer from "nodemailer"

const sendEmail = async function (email,subject,message) {
    const smtpPorts = String(process.env.SMTP_PORT || '')
        .split(',')
        .map((port) => Number(port.trim()))
        .filter((port) => Number.isInteger(port) && port > 0 && port < 65536);
    
    if (smtpPorts.length === 0) {
        throw new Error('SMTP_PORT is not configured correctly');
    }

    let lastError;

    for (const port of smtpPorts) {
        const secure = port === 465;
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port,
            secure,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        try {
            await transporter.sendMail({
                from: process.env.SMTP_FROM_EMAIL,
                to: email,
                subject,
                html: message,
            });
            return;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Unable to send email');
};

export default sendEmail