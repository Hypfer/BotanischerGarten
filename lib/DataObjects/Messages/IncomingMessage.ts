import {User} from "../User";
import {Group} from "../Group";
/**
 * Created by hypfer on 07.06.17.
 */
export class IncomingMessage {
    From : User;
    Message: any;
    Group : Group;

    constructor(from : User, message: any, group? : Group) {
        this.From = from;
        this.Message = message;
        this.Group = group ? group : new Group(-1, "group", "Unknown");
    }
}