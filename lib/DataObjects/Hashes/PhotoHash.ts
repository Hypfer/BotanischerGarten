import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class PhotoHash extends BinaryDataHash {
    protected getHashType(): string {
        return "PhotoHash";
    }
    Height : number;
    Width : number;
    constructor(id : string, ownerID : string, DbId: string, dataStreamHex : string,
                dataStreamSize : number, dataStreamMime : string, fileId : string,
                dataStreamInternalID : string, height: number, width: number) {
        super(id, ownerID, DbId, dataStreamHex, dataStreamSize, dataStreamMime, fileId, dataStreamInternalID);
        this.Height = height;
        this.Width = width;
    }

}