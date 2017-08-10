import {Hash} from "./Hash";
/**
 * Created by hypfer on 08.06.17.
 */
export abstract class BinaryDataHash extends Hash {
    DataStreamHex: string;
    DataStreamSize: number;
    DataStreamMime: string;
    FileId: string;
    DataStreamInternalID: string;

    constructor(id: string, ownerID: number, DbId: string, Source: number, Public: Boolean, dataStreamHex: string,
                dataStreamSize: number, dataStreamMime: string,
                fileId: string, dataStreamInternalID: string) {
        super(id, ownerID, DbId, Source, Public);
        this.DataStreamHex = dataStreamHex;
        this.DataStreamSize = dataStreamSize;
        this.DataStreamMime = dataStreamMime;
        this.FileId = fileId;
        this.DataStreamInternalID = dataStreamInternalID;
    }
}