import dotenv from 'dotenv';
dotenv.config();
import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { emailTemplate } from './emailTemplate.js';

export const sendWelcomeEmail = async (email: string, full_name: string, profile_image_url: string) => {
  const recipient = [{email}]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Welcome to Jarro\'s LinkedIn Clone',
      html: emailTemplate(full_name, profile_image_url),
    });
    console.log('response ============== ', response);
  } catch (error) {
    console.log('mail trap error ================ ', error);
  }
};