import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events.js";
import Tesseract, { createWorker } from "tesseract.js";

type Io = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const recognize = async (imgPath: string, io: Io | undefined = undefined) => {
    const worker = await createWorker({
        // tesseract-core-simd.wasm.js:108 failed to asynchronously prepare wasm: RangeError: WebAssembly.instantiate(): Out of memory: wasm memory
        // tesseract.js RangeError: WebAssembly.instantiate() Out of memory: wasm memory
        // Uncaught (in promise) RuntimeError: Aborted(RangeError: WebAssembly.instantiate(): Out of memory: wasm memory). Build with -sASSERTIONS for more info.
        logger: (message) => {
            if (io) io.emit("loading", { progress: message.progress });
            console.log(message.progress);
        },

        // gzip: false,
        // // langPath: "lang",
        // corePath: "/core",
        // workerPath: "/dist/worker.min.js",
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
