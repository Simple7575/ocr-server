import dotenv from "dotenv";

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const MODE = process.env.MODE;
export const WEB_URI = process.env.WEB_URI;
export const PORT = process.env.PORT || 3000;
