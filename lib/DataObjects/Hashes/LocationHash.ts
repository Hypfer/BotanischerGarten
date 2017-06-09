import {Hash} from "./Hash";
/**
 * Created by hypfer on 08.06.17.
 */
export class LocationHash extends Hash {
    protected getHashType(): string {
        return "LocationHash";
    }
    Latitude : number;
    Longitude : number;
    constructor(id : string, ownerID : string, latitude : number, longitude : number) {
        super(id, ownerID);
        this.Latitude = latitude;
        this.Longitude = longitude;
    }


}