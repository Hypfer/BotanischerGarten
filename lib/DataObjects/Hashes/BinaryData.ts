/**
 * Created by hypfer on 08.06.17.
 */
export class BinaryData {
    DataStreamHex : string;
    DataStreamSize: number;
    DataStreamMime: string;
    constructor(hex : string, size: number, mime : string) {
        this.DataStreamHex = hex;
        this.DataStreamSize = size;
        this.DataStreamMime = mime;
    }
}