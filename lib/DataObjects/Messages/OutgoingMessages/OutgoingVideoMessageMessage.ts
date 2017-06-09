import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingVideoMessageMessage extends OutgoingMessage {
    DataStreamHex : string;
    FileId : string;
    Height : number;
    Width : number;
    Duration : number;
    DataStreamInternalID : string;
    constructor(hex : string, fileid : string, height : number,
                width : number, duration : number, localFileID : string) {
        super();
        this.DataStreamHex = hex;
        this.FileId = fileid;
        this.Height = height;
        this.Width = width;
        this.Duration = duration;
        this.DataStreamInternalID = localFileID;
    }
}