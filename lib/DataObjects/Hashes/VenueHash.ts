import {LocationHash} from "./LocationHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class VenueHash extends LocationHash {
    protected getHashType(): string {
        return "VenueHash";
    }
    Title : string;
    Address : string;
    Foursquare_id : string;
    constructor(id : string, ownerID : string, DbId: string, Source : number, Public : Boolean,
                latitude : number, longitude : number,
                title : string, address : string, foursquare_id : string) {
        super(id, ownerID, DbId, Source, Public, latitude, longitude);
        this.Title = title;
        this.Address = address;
        this.Foursquare_id = foursquare_id;
    }
}