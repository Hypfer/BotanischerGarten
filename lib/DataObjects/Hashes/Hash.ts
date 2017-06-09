/**
 * Created by hypfer on 08.06.17.
 */
export abstract class Hash {
    HashType : string;
    ID : string;
    OwnerID : string;

    constructor(id : string, ownerID : string) {
        this.HashType = this.getHashType();
        this.ID = id;
        this.OwnerID = ownerID;
    }

    protected abstract getHashType() : string;
}