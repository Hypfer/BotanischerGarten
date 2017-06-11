import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class VideoMessageHash extends BinaryDataHash {
    protected getHashType(): string {
        return "VideoMessageHash";
    }
    Height : number;
    Width : number;
    Duration : number;
    constructor(id : string, ownerID : string, dataStreamHex : string,
                dataStreamSize : number, dataStreamMime : string, fileId : string,
                dataStreamInternalID : string, height: number, width: number, duration : number) {
        super(id, ownerID, dataStreamHex, dataStreamSize, dataStreamMime, fileId, dataStreamInternalID);
        this.Height = height;
        this.Width = width;
        this.Duration = duration;
    }
}