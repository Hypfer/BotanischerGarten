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
    constructor(id : string, ownerID : string, DbId: string, latitude : number, longitude : number) {
        super(id, ownerID, DbId);
        this.Latitude = latitude;
        this.Longitude = longitude;
    }


}