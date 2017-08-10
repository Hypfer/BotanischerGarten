import {OutgoingMessage} from "./OutgoingMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingLocationMessage extends OutgoingMessage {
    Latitude: number;
    Longitude: number;

    constructor(latitude: number, longitude: number) {
        super();
        this.Latitude = latitude;
        this.Longitude = longitude;
    }
}