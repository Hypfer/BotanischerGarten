import {Hash} from "./Hash";
/**
 * Created by hypfer on 08.06.17.
 */
export class TextHash extends Hash {
    protected getHashType(): string {
        return "TextHash";
    }

    Text: string;

    constructor(id: string, ownerID: number, DbId: string, Source: number, Public: Boolean, text: string) {
        super(id, ownerID, DbId, Source, Public);
        this.Text = text;
    }
}