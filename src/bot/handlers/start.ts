import { CommandContext } from "grammy";
//
import User from "../../db/schemas/userSchema.js";
// types
import { type ContextType } from "../../types/context";

export const start = async (ctx: CommandContext<ContextType>) => {
    const from = ctx.update.message!.from;

    try {
        const existingUser = await User.findOne({ id: from.id });

        if (!existingUser) {
            const newUser = new User({
                ...(from as Object),
            });
            await newUser.save();
        }

        await ctx.reply(`Here are some functionalities
/ocr: "Image to Text converter"`);
    } catch (error) {
        console.error(error);
    }
};
