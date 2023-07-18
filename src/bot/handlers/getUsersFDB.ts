import User from "../../db/schemas/userSchema.js";
import { promises as fs } from "fs";
// types
import { type CommandContext } from "grammy";
import { type ContextType } from "../../types/context.js";

export const getusersFromDB = async (ctx: CommandContext<ContextType>) => {
    try {
        // const archivedUsers = await Archive.find();
        const users = await User.find();
        await fs.writeFile("./jsons/users.json", JSON.stringify(users, null, 4));
    } catch (error) {
        console.error(error);
    }
};
