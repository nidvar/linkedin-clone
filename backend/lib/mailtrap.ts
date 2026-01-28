import dotenv from 'dotenv';
import { MailtrapClient } from 'mailtrap';
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({token: TOKEN as string});