import {BinaryDataHash} from "./BinaryDataHash";
import {Thumbnail} from "./Thumbnail";
/**
 * Created by hypfer on 08.06.17.
 */
export class DocumentHash extends BinaryDataHash {
    Thumb : Thumbnail;
    protected getHashType(): string {
        return "DocumentHash";
    }
    constructor(id: string, ownerID: number, DbId: string, Source: number, Public: Boolean, dataStreamHex: string,
                dataStreamSize: number, dataStreamMime: string,
                fileId: string, dataStreamInternalID: string, thumb? : Thumbnail) {
        super(id, ownerID, DbId, Source, Public, dataStreamHex, dataStreamSize,
            dataStreamMime, fileId, dataStreamInternalID);

        this.Thumb = thumb;
    }
}