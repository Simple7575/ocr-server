import express from "express";
import cors from "cors";
import helmet from "helmet";
import cv from "@techstark/opencv-js";
//
import { bot } from "./bot/index.js";
import { BOT_TOKEN, PORT, WEB_URI, MODE } from "./constants.js";
import botRouter from "./bot/route.js";
import { connectDB } from "./db/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/bot", botRouter);

cv["onRuntimeInitialized"] = () => {
    console.log("CV Initialized");

    connectDB().then(() => {
        console.log("DB connected.");

        app.listen(PORT, async () => {
            console.log(`Listening on port ${PORT}`);

            if (MODE === "Dev") {
                await bot.start({ drop_pending_updates: true });
                console.log("Bot started with polling.");
            } else {
                if (!BOT_TOKEN) throw new Error("Bot Token needed.");
                if (!WEB_URI) throw new Error("Web URI needed");

                await bot.api.setWebhook(
                    `${WEB_URI || "http://localhost:5000"}/bot/bot${BOT_TOKEN}`,
                    {
                        drop_pending_updates: true,
                    }
                );
                console.log("Bot started with webhook.");
            }
        });
    });
};
