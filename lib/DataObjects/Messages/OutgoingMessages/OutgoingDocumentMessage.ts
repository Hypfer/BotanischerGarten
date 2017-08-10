import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingDocumentMessage extends OutgoingMessage {
    DataStreamHex: string;
    FileId: string;
    DataStreamInternalID: string;

    constructor(hex: string, fileid: string, localFileID: string) {
        super();
        this.DataStreamHex = hex;
        this.FileId = fileid;
        this.DataStreamInternalID = localFileID;
    }
}