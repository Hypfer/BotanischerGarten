/**
 * Created by hypfer on 08.06.17.
 */
export abstract class Hash {
    HashType : string;
    ID : string;
    OwnerID : string;
    DbId : string;

    constructor(id : string, ownerID : string, DbId : string) {
        this.HashType = this.getHashType();
        this.ID = id;
        this.OwnerID = ownerID;
        this.DbId = DbId;
    }

    protected abstract getHashType() : string;
}