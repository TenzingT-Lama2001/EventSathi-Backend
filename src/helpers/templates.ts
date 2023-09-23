import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

export enum MailType {
  new_registration_otp = 'NEW_REGISTRATION_OTP',
  reset_password_otp = 'RESET_PASSWORD_OTP',
  account_activation_otp = 'ACCOUNT_ACTIVATION_OTP',
}

export interface MailTemplate {
  otp?: string;
  role?: string;
}

export const getMailTemplates = async (
  mailType: MailType,
  data: MailTemplate,
) => {
  let source: string;
  console.log(__dirname);
  if (mailType === MailType.new_registration_otp) {
    source = fs.readFileSync(
      path.join(__dirname, `../templates/registration-otp.html`),
      'utf8',
    );
  } else if (mailType === MailType.reset_password_otp) {
    source = fs.readFileSync(
      path.join(__dirname, `../templates/reset-password.html`),
      'utf8',
    );
  } else if (mailType === MailType.account_activation_otp) {
    source = fs.readFileSync(
      path.join(__dirname, `../templates/account-activation.html`),
      'utf8',
    );
  }

  try {
    const template = Handlebars.compile(source);
    const result = template(data);
    return result;
  } catch (error) {
    console.error('Error compiling the template:', error);
    throw error; // Rethrow the error to handle it at a higher level
  }
};
