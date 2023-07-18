import User from "../../db/schemas/userSchema.js";

type IsOCRAllowed<T extends "Allow" | "Disallow"> = T extends "Allow"
    ? ["Allow", null]
    : ["Disallow", Date];

export const incOcrUsedQuantity = async (id: number) => {
    await User.findOneAndUpdate({ id }, { $inc: { usedQuantity: 1 } });
};

const resetOcrUsedQuantity = async (id: number) => {
    await User.findOneAndUpdate(
        { id },
        {
            $set: { usedQuantity: 0, lastUse: new Date() },
        }
    );
};

export const checkOcrUsedQuantity = async (
    id: number
): Promise<IsOCRAllowed<"Allow" | "Disallow">> => {
    const user = await User.findOne({ id });
    const usedQuantity = user!.usedQuantity;

    const now = Date.now();
    const lastUse = new Date(user!.lastUse).getTime();
    const oneDay = 8.64e7;

    if (now > lastUse + oneDay) {
        await resetOcrUsedQuantity(id);
        return ["Allow", null];
    } else {
        if (usedQuantity < 3) {
            return ["Allow", null];
        } else {
            return ["Disallow", user!.lastUse];
        }
    }
};
