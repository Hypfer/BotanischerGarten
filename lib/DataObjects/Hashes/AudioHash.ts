import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class AudioHash extends BinaryDataHash {
    protected getHashType(): string {
        return "AudioHash";
    }
    Performer : string;
    Title : string;
    Duration : number;
    constructor(id : string, ownerID : string, DbId: string, dataStreamHex : string,
                dataStreamSize : number, dataStreamMime : string, fileId : string,
                dataStreamInternalID : string, performer: string, title: string, duration : number) {
        super(id, ownerID, DbId, dataStreamHex, dataStreamSize, dataStreamMime, fileId, dataStreamInternalID);
        this.Performer = performer;
        this.Title = title;
        this.Duration = duration;
    }

}