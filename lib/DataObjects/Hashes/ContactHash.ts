import {Hash} from "./Hash";
/**
 * Created by hypfer on 08.06.17.
 */
export class ContactHash extends Hash {
    protected getHashType(): string {
        return "ContactHash";
    }
    Phone_number : string;
    First_name : string;
    Last_name : string;
    constructor(id : string, ownerID : string, DbId: string,
                phone_number : string, first_name : string, last_name? : string) {
        super(id, ownerID, DbId);
        this.Phone_number = phone_number;
        this.First_name = first_name;
        this.Last_name = last_name;
    }
}