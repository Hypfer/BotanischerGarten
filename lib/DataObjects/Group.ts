/**
 * Created by Hypfer on 09/08/2017.
 */
export class Group {
    ID: number;
    Type: "group" | "supergroup";
    Name: string;
    MemberIDs: Array<number>;

    constructor(id: number, type: "group" | "supergroup", name: string, memberIDs?: Array<number>) {
        this.ID = id;
        this.Type = type;
        this.Name = name;
        this.MemberIDs = memberIDs ? memberIDs : [];
    }

    isMember(userID: number): boolean {
        return this.MemberIDs.indexOf(userID) !== -1;
    }

    addMember(userID: number): void {
        if (!this.isMember(userID)) {
            this.MemberIDs.push(userID);
        }
    }

    removeMember(userID: number): void {
        const index = this.MemberIDs.indexOf(userID);
        if (index !== -1) {
            this.MemberIDs.splice(index, 1);
        }
    }
}