import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 06.06.17.
 */
export class OutgoingTextMessage extends OutgoingMessage {
    Text : string;

    constructor(text : string) {
        super();
        this.Text = text;
    }
}