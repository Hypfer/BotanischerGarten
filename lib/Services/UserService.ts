import {IRepository} from "../Repositories/IRepository";
import {Service} from "./Service";
import {User} from "../DataObjects/User";
/**
 * Created by hypfer on 06.06.17.
 */
type UserCallback = (hash : User) => any;
export class UserService extends Service{

    protected getCollection(): string {
        return "User";
    }

    FindUser(user : User, callback : UserCallback) : any {
        const self = this;

        super.GetById(user.ID, function(result){
            if(result) {
                callback(new User(result.ID, result.FirstName, result.Roles, result.Username));
            } else {
                const newUser = new User(user.ID, user.FirstName, [], user.Username);
                self.SaveUser(newUser, function(){
                    callback(newUser);
                });
            }
        });

    }
    SaveUser(user: User, callback : UserCallback) : any {
        super.Save(user.ID, user, callback);
    }
}