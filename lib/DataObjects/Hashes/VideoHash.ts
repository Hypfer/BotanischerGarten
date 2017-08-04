import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class VideoHash extends BinaryDataHash {
    protected getHashType(): string {
        return "VideoHash";
    }
    Height : number;
    Width : number;
    Duration : number;
    constructor(id : string, ownerID : string, DbId: string, dataStreamHex : string,
                dataStreamSize : number, dataStreamMime : string, fileId : string,
                dataStreamInternalID : string, height: number, width: number, duration : number) {
        super(id, ownerID, DbId, dataStreamHex, dataStreamSize, dataStreamMime, fileId, dataStreamInternalID);
        this.Height = height;
        this.Width = width;
        this.Duration = duration;
    }
}