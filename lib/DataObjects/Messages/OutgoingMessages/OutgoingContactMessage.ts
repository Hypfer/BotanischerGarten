import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingContactMessage extends OutgoingMessage {
    Phone_number: string;
    First_name: string;
    Last_name: string;

    constructor(phone_number: string, first_name: string, last_name?: string) {
        super();
        this.Phone_number = phone_number;
        this.First_name = first_name;
        this.Last_name = last_name;
    }
}