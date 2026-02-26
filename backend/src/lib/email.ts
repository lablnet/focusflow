import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
}

/**
 * Function to send an email using the SMTP configuration provided in the environment variables.
 *
 * @param options - Email options including recipient, subject, content, and optional attachments
 * 
 * @since v1.0.0
 * @return void
 */
const sendEmail = async (options: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      type: "login",
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as SMTPTransport.Options);

  const senderEmail = process.env.SMTP_SENDER_EMAIL || process.env.FROM_EMAIL;
  const mailOptions: any = {
    from: `Skywolf <${senderEmail}>`,
    to: options.to,
    subject: options.subject,
  };

  // Add HTML content if provided
  if (options.html) {
    mailOptions.html = options.html;
  }

  // Add text content if provided
  if (options.text) {
    mailOptions.text = options.text;
  }

  // Add attachments if provided
  if (options.attachments && options.attachments.length > 0) {
    mailOptions.attachments = options.attachments;
  }

  await transporter.sendMail(mailOptions);
};

// Backward compatibility function
const sendSimpleEmail = async (to: string, subject: string, body: string) => {
  await sendEmail({
    to,
    subject,
    html: body,
    text: body,
  });
};

export { sendEmail, sendSimpleEmail };
