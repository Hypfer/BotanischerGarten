import {BinaryDataHash} from "./BinaryDataHash";
import {Thumbnail} from "./Thumbnail";
/**
 * Created by hypfer on 08.06.17.
 */
export class PhotoHash extends BinaryDataHash {
    protected getHashType(): string {
        return "PhotoHash";
    }

    Height: number;
    Width: number;
    Thumb: Thumbnail;

    constructor(id: string, ownerID: number, DbId: string, Source: number, Public: Boolean, dataStreamHex: string,
                dataStreamSize: number, dataStreamMime: string, fileId: string,
                dataStreamInternalID: string, height: number, width: number, thumb? : Thumbnail) {
        super(id, ownerID, DbId, Source, Public, dataStreamHex, dataStreamSize,
            dataStreamMime, fileId, dataStreamInternalID);
        this.Height = height;
        this.Width = width;
        this.Thumb = thumb;
    }

}