/**
 * Created by hypfer on 06.06.17.
 */
export class User {
    ID : string;
    FirstName : string;
    Username : string;
    Roles : Array<string>;

    constructor(id : string, firstName : string, roles: Array<string>, username?: string) {
        this.ID = id;
        this.FirstName = firstName;
        this.Roles = roles;
        this.Username = username;
    }

    hasRole(role : string) : boolean {
        return this.Roles.indexOf(role) !== -1;
    }
}