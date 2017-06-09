import {User} from "../User";
/**
 * Created by hypfer on 07.06.17.
 */
export class IncomingMessage {
    From : User;
    Message: any;

    constructor(from : User, message: any) {
        this.From = from;
        this.Message = message;
    }
}