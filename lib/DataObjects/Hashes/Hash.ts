/**
 * Created by hypfer on 08.06.17.
 */
export abstract class Hash {
    HashType: string;
    ID: string;
    OwnerID: number;
    DbId: string;
    Source: number;
    Public: Boolean;

    constructor(id: string, ownerID: number, DbId: string, Source: number, Public: Boolean) {
        this.HashType = this.getHashType();
        this.ID = id;
        this.OwnerID = ownerID;
        this.DbId = DbId;
        this.Source = Source;
        this.Public = Public;
    }

    protected abstract getHashType(): string;
}