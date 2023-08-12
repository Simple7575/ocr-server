import { type Request, type Response } from "express";
//
import { recognize } from "../utils/recognize.js";

export const ocrHandler = async (req: Request, res: Response) => {
    try {
        const text = await recognize(req.body.image);

        res.status(200).json({ text });
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
};
