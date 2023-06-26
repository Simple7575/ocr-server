import { CommandContext } from "grammy";
// types
import { type ContextType } from "../../types/context";

export const start = async (ctx: CommandContext<ContextType>) => {
    await ctx.reply(`Here are some functionalities
/ocr: "Image to Text converter"`);
};
