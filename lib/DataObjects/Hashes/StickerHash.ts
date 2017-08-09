import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class StickerHash extends BinaryDataHash {
    protected getHashType(): string {
        return "StickerHash";
    }
    Width : number;
    Height : number;
    Emoji : string;
    constructor(id : string, ownerID : number, DbId: string, Source : number, Public : Boolean, dataStreamHex : string,
                dataStreamSize : number, dataStreamMime : string, fileId : string,
                dataStreamInternalID : string, width: number, height: number, emoji : string) {
        super(id, ownerID, DbId, Source, Public,
              dataStreamHex, dataStreamSize, dataStreamMime, fileId, dataStreamInternalID);
        this.Width = width;
        this.Height = height;
        this.Emoji = emoji;
    }
}