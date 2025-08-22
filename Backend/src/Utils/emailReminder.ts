import dayjs from "dayjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "scit0032@gmail.com",
        pass: "vlws gwef xdvh dkip",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const sendReminder = async (
    email: string,
    eventName: string,
    eventTime: string
) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `📅 Reminder: ${eventName}`,
        html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 40px;">
                    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); overflow: hidden;">
                        <div style="padding: 25px; text-align: center; border-bottom: 1px solid #eee;">
                         <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: #222;">Event Reminder</h2>
                        </div>

                        <div style="padding: 25px; color: #333; font-size: 15px; line-height: 1.6;">
                          <p style="margin: 0 0 12px 0;">Hi there,</p>
                          <p style="margin: 0 0 20px 0;">Here’s a quick reminder for your upcoming event:</p>

                          <div style="border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 0 0 6px 0; font-weight: 600;"><strong>Event Name :</strong> ${eventName}</p>
                            <p style="margin: 0; font-weight: 500;"><strong>Date & Time:</strong> ${dayjs(eventTime).format("DD MMM YYYY, hh:mm A")}</p>
                          </div>

                          <p style="margin: 0 0 25px 0;">Please be prepared and don’t miss it!</p>

                          <p style="margin: 0; font-size: 13px; color: #888; text-align: center;">This is an automated reminder from your Calendar App.</p>
                        </div>

                    </div>
                </div>
            `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}: ${info.response}`);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};
