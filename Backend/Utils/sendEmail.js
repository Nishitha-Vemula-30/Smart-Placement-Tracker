import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const hasSmtpConfig =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    if (hasSmtpConfig) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || "Smart Placement Tracker"}" <${process.env.SMTP_FROM_EMAIL || "placement-tracker@college.edu"}>`,
        to,
        subject,
        text,
        html: html || text,
      });

      console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log("=========================================");
      console.log(`[MOCK EMAIL SENT]`);
      console.log(`To:      ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:    ${text}`);
      console.log("=========================================");
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error.message);
    // Fallback log so the process doesn't completely crash for the student
    console.log("=========================================");
    console.log(`[FALLBACK EMAIL LOG due to error]`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:    ${text}`);
    console.log("=========================================");
    return { success: false, error: error.message };
  }
};
