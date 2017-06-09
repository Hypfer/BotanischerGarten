import {OutgoingLocationMessage} from "./OutgoingLocationMessage";
/**
 * Created by hypfer on 08.06.17.
 */
export class OutgoingVenueMessage extends OutgoingLocationMessage {
    Title : string;
    Address: string;
    Foursquare_id : string;

    constructor(latitude : number, longitude : number, title : string, address : string,
                foursquare_id : string) {
        super(latitude, longitude);
        this.Title = title;
        this.Address = address;
        this.Foursquare_id = foursquare_id;
    }
}