import { Storage } from 'megajs';
import dotenv from 'dotenv';
dotenv.config();

export const megaStorage = new Storage({
  email: process.env.MEGA_EMAIL,
  password: process.env.MEGA_PASSWORD,
  userAgent: 'MyApp/1.0'
});

// Ensure login happens
await new Promise((resolve, reject) => {
  megaStorage.on('ready', resolve);
  megaStorage.on('error', reject);
});
