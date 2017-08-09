/**
 * Created by Hypfer on 09/08/2017.
 */
export class Group {
    ID : string;
    Type: "group" | "supergroup";
    Name : string;
    MemberIDs : Array<string>;

    constructor(id: string, type: "group" | "supergroup", name : string, memberIDs? : Array<string>) {
        this.ID = id;
        this.Type = type;
        this.Name = name;
        this.MemberIDs = memberIDs ? memberIDs : [];
    }

    isMember(userID : string) : boolean {
        return this.MemberIDs.indexOf(userID) !== -1;
    }

    addMember(userID : string) : void {
        if (!this.isMember(userID)) {
            this.MemberIDs.push(userID);
        }
    }

    removeMember(userID : string) : void {
        const index = this.MemberIDs.indexOf(userID);
        if(index !== -1) {
            this.MemberIDs.splice(index, 1);
        }
    }
}