import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class VoiceHash extends BinaryDataHash {
    protected getHashType(): string {
        return "VoiceHash";
    }
    Duration : number;
    constructor(id : string, ownerID : string, DbId: string, Source : number, Public : Boolean, dataStreamHex : string,
                dataStreamSize : number, dataStreamMime : string, fileId : string,
                dataStreamInternalID : string, duration : number) {
        super(id, ownerID, DbId, Source, Public,
              dataStreamHex, dataStreamSize, dataStreamMime, fileId, dataStreamInternalID);
        this.Duration = duration;
    }
}