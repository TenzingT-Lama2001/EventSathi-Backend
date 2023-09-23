import { createTransport, SendMailOptions } from 'nodemailer';
import { Printer } from './printer';
import { SMTP_INFO } from 'src/config';

const transporter = createTransport({
  host: SMTP_INFO.host,
  port: 587,
  auth: {
    user: SMTP_INFO.user,
    pass: SMTP_INFO.password,
  },
});

const sendMail = async (options: SendMailOptions) => {
  try {
    options.from = SMTP_INFO.user;
    const result = await transporter.sendMail(options);
    Printer('SEND MAIL RESULT START', result);
  } catch (err) {
    Printer('SEND MAIL ERROR START', err);
  }
};

export { sendMail };
