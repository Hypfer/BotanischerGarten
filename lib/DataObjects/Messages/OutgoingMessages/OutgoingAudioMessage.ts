import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingAudioMessage extends OutgoingMessage {
    DataStreamHex: string;
    FileId: string;
    Performer: string;
    Title: string;
    Duration: number;
    DataStreamInternalID: string;

    constructor(hex: string, fileid: string, performer: string,
                title: string, duration: number, localFileID: string) {
        super();
        this.DataStreamHex = hex;
        this.FileId = fileid;
        this.Performer = performer || "UNKNOWN";
        this.Title = title || "UNKNOWN";
        this.Duration = duration;
        this.DataStreamInternalID = localFileID;
    }
}