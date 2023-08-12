import { Router } from "express";
import { bot } from "../index.js";

const botRouter = Router();

botRouter.post("/:bot", async (req, res) => {
    const update = req.body;

    await bot.init();
    bot.handleUpdate(update);

    res.status(200).send("Ok");
});

export { botRouter };
