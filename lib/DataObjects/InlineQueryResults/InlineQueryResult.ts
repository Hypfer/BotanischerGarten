/**
 * Created by hypfer on 07.06.17.
 */
export abstract class InlineQueryResult {
    type : string;
    id: string;
    constructor(id : string) {
        this.id = id;
        this.type = this.getType();
    }
    protected abstract getType() : string;
}