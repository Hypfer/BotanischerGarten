import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingStickerMessage extends OutgoingMessage {
    DataStreamHex: string;
    FileId: string;
    Height: number;
    Width: number;
    Emoji: string;
    DataStreamInternalID: string;

    constructor(hex: string, fileid: string, height: number, width: number,
                emoji: string, localFileID: string) {
        super();
        this.DataStreamHex = hex;
        this.FileId = fileid;
        this.Height = height;
        this.Width = width;
        this.Emoji = emoji;
        this.DataStreamInternalID = localFileID;
    }
}