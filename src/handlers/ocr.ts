import { type Request, type Response } from "express";
//
import { recognize } from "../utils/recognize.js";

export const ocrHandler = async (req: Request, res: Response) => {
    try {
        const io = req.app.get("socketio");

        const text = await recognize(req.body.image, io);

        res.status(200).json({ text });
    } catch (error) {
        if (error instanceof Error) console.error(error.message);
    }
};
