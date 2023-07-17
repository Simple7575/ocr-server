import { Canvas, createCanvas, Image, ImageData, loadImage } from "canvas";

type Image = typeof Image;

export interface global {}
declare global {
    var Module: {};
    var Image: Image;
    var HTMLCanvasElement: Canvas;
    var ImageData: ImageData;
    var HTMLImageElement: Image;
}
