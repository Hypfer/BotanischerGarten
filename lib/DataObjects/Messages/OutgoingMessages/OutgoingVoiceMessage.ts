import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingVoiceMessage extends OutgoingMessage {
    DataStreamHex : string;
    FileId : string;
    Duration : number;
    DataStreamInternalID : string;
    constructor(hex : string, fileid : string, duration : number, localFileID : string) {
        super();
        this.DataStreamHex = hex;
        this.FileId = fileid;
        this.Duration = duration;
        this.DataStreamInternalID = localFileID;
    }
}