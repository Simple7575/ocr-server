import { Canvas, createCanvas, Image, ImageData, loadImage } from "canvas";
import cv from "@techstark/opencv-js";

type Image = typeof Image;

export interface global {}
declare global {
    var Module: {};
    var cv: cv;
    var Image: Image;
    var HTMLCanvasElement: Canvas;
    var ImageData: ImageData;
    var HTMLImageElement: Image;
}
