import { Canvas, createCanvas, Image, ImageData, loadImage } from "canvas";
import { JSDOM } from "jsdom";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import cv, { error } from "@techstark/opencv-js";
import Tesseract, { createWorker } from "tesseract.js";
import Jimp from "jimp";
// types
import { type ConversationType, type ContextType } from "../../types/context";

const recognize = async (imgPath: string = "./img/processed.jpg") => {
    const worker = await createWorker({
        logger: (message) => console.log(message.progress),
    });

    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO_ONLY,
        tessedit_ocr_engine_mode: Tesseract.OEM.TESSERACT_ONLY,
        preserve_interword_spaces: "0",
        // tessedit_write_images: true,
    });

    const res = await worker.recognize(imgPath);
    await worker.terminate();

    return res.data.text;
};

function installDOM() {
    const dom = new JSDOM();

    global.document = dom.window.document;
    // @ts-expect-error
    global.Image = Image;
    // @ts-expect-error
    global.HTMLCanvasElement = Canvas;
    // @ts-expect-error
    global.ImageData = ImageData;
    // @ts-expect-error
    global.HTMLImageElement = Image;
}

const processImage = async (imgPath: string = "./img/example.jpg", cb: (s: string) => void) => {
    console.log("Outer");
    try {
        installDOM();
        // cv["onRuntimeInitialized"] = () => {
        console.log("Inner");
        loadImage(imgPath).then((image) => {
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext("2d");

            // @ts-expect-error
            const src = cv.imread(image);
            const dst = new cv.Mat();
            cv.resize(src, dst, new cv.Size(0, 0), 7, 7, cv.INTER_CUBIC);
            cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
            cv.threshold(dst, dst, 158, 255, cv.THRESH_TOZERO);
            let ksize = new cv.Size(13, 13);
            cv.GaussianBlur(dst, dst, ksize, 100, 0, cv.BORDER_DEFAULT);
            // @ts-expect-error
            cv.imshow(canvas, dst);
            src.delete();
            dst.delete();
            writeFileSync("./img/processed.jpg", canvas.toBuffer("image/jpeg"));
            cb("./img/processed.jpg");
        });
        // };
    } catch (error) {
        console.error(error);
    }
};
//     console.log(cv.getBuildInformation());
// } else {
//     console.log("Else");
//     // WASM
//     cv["onRuntimeInitialized"] = () => {
//         console.log(cv.getBuildInformation());
//     };
// }

export const Ocr = async (conversations: ConversationType, ctx: ContextType) => {
    try {
        await ctx.reply("Ok I am ready, send me the image.");

        const {
            message: { photo },
        } = await conversations.waitFor("message:photo");
        const photoInfo = await ctx.api.getFile(photo[3].file_id);
        // const imgUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${photoInfo.file_path}`;
        const imgPath = await photoInfo.download(`./img/${photo[3].file_unique_id}.jpg`);
        await processImage(imgPath, (path) => {
            recognize(path).then((text) => {
                ctx.reply(text);
            });
        });
    } catch (error) {
        console.error(error);
    }
};
