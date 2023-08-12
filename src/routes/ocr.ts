import { Router } from "express";
//
import { ocrHandler } from "../handlers/ocr.js";

const ocrRouter = Router();

ocrRouter.post("/", ocrHandler);

export { ocrRouter };
