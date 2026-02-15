const nodemailer = require("nodemailer");

let transporterPromise = null;

const getTransporter = () => {
    if (transporterPromise) return transporterPromise;

    transporterPromise = (async () => {
        // Check if we have valid-looking SMTP credentials
        const hasCredentials =
            process.env.SMTP_USER &&
            process.env.SMTP_PASS &&
            !process.env.SMTP_USER.includes("your_email");

        if (hasCredentials) {
            console.log("📧 Using SMTP Configured in .env");
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST || "smtp.gmail.com",
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }

        // Fallback to Ethereal (Fake SMTP)
        console.log("⚠️  No valid SMTP config found. Using Ethereal for testing.");
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log("📧 Ethereal Test Account Created:", testAccount.user);
        return transporter;
    })();

    return transporterPromise;
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = await getTransporter();

        // Set 'from' address
        const from = process.env.SMTP_FROM || '"Fleetiva Support" <no-reply@fleetiva.com>';

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });

        console.log("✅ Message sent: %s", info.messageId);

        // Preview only available when using Ethereal
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("==================================================");
            console.log("🔗 PREVIEW EMAIL HERE: %s", previewUrl);
            console.log("==================================================");
        }

        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw error;
    }
};

module.exports = sendEmail;
