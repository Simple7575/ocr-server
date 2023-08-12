import express from "express";
import cors from "cors";
import helmet from "helmet";
// import cv from "@techstark/opencv-js";
//
import { bot } from "./bot/index.js";
import { BOT_TOKEN, PORT, WEB_URI, MODE } from "./constants.js";
import { botRouter } from "./bot/routes/update.js";
import { ocrRouter } from "./routes/ocr.js";
import { connectDB } from "./db/index.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/bot", botRouter);
app.use("/ocr", ocrRouter);

app.get("/wake", (req, res) => {
    res.status(200).json({ message: "Ok! Ok! I'm wake!" });
});

// cv["onRuntimeInitialized"] = () => {
//     console.log("CV Initialized");

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

            await bot.api.setWebhook(`${WEB_URI || "http://localhost:5000"}/bot/bot${BOT_TOKEN}`, {
                drop_pending_updates: true,
            });
            console.log("Bot started with webhook.");
        }
    });
});
// };
