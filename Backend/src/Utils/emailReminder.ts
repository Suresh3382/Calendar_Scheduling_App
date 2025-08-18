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
        html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); overflow: hidden;">
    
                  <div style="padding: 30px 25px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                    <h1 style="margin: 0; font-size: 30px; color: #333;">Upcoming Event Reminder</h1>
                    </div>
    
                  <div style="padding: 35px 25px; color: #333; font-size: 16px; line-height: 1.7;">
                    <p>Hi there,</p>
                    <p>This is a friendly reminder for your upcoming event:</p>
      
                    <div style="background: #f8f8ff; padding: 22px; border-radius: 10px; margin: 25px 0; border: 1px solid #e0e0ff;">
                         <p style="margin: 0 0 8px 0; font-weight: 600;"><strong>Event:</strong> ${eventName}</p>
                            <p style="margin: 0; font-weight: 500;"><strong>Date & Time:</strong> ${dayjs(
                           eventTime
                        ).format("DD MMM YYYY, hh:mm A")}</p>
                    </div>
      
                     <p>Make sure you’re ready and prepared!</p>
                  
                     <p style="margin-top: 30px; font-size: 14px; color: #999;">This is an automated reminder from your Calendar App.</p>
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
