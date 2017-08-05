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
    constructor(id : string, ownerID : string, DbId: string, Source : number, Public : Boolean,
                latitude : number, longitude : number) {
        super(id, ownerID, DbId, Source, Public);
        this.Latitude = latitude;
        this.Longitude = longitude;
    }


}