import {BinaryData} from "./BinaryData";
/**
 * Created by Hypfer on 12/08/2017.
 */
export class Thumbnail extends BinaryData {
    Height: number;
    Width: number;

    constructor(hex: string, size: number, mime: string, height: number, width: number) {
        super(hex, size, mime);
        this.Height = height;
        this.Width = width;
    }
}