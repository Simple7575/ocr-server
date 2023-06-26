import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { hydrateFiles } from "@grammyjs/files";
import dotenv from "dotenv";
import cv from "@techstark/opencv-js";
// internal
import { start } from "./handlers/start.js";
import { Ocr } from "./conversation/ocr.js";
// types
import { type ContextType, type ApiType } from "../types/context";

dotenv.config();

const Token = process.env.BOT_TOKEN;
if (!Token) throw new Error("Bot Token needed.");
const bot = new Bot<ContextType, ApiType>(Token);

bot.use(
    session({
        initial() {
            return {};
        },
        getSessionKey(ctx) {
            return ctx.from?.id.toString();
        },
    })
);
bot.use(conversations());
bot.use(createConversation(Ocr));
// Use the plugin.
bot.api.config.use(hydrateFiles(bot.token));

bot.api.setMyCommands([
    {
        command: "start",
        description: "Start",
    },
    {
        command: "ocr",
        description: "Image to text converter.",
    },
]);

bot.command("start", start);
bot.command("ocr", async (ctx) => {
    await ctx.conversation.enter("Ocr");
});

cv["onRuntimeInitialized"] = () => {
    console.log("CV Initialized");
    bot.start({ drop_pending_updates: true });
};
