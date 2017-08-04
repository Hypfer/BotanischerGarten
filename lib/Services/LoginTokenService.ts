import {Service} from "./Service";
import * as uuid from "uuid";
/**
 * Created by Hypfer on 04/08/2017.
 */
export class LoginTokenService extends Service {
    protected getCollection(): string {
        return "loginToken";
    }

    public createToken(callback : Function) {
        const token : string = uuid.v4();
        super.Save(token, {}, function(){
            callback(token);
        });
    }

    public consumeToken(token : string, callback: Function) {
        const self = this;
        super.GetById(token, function(doc){
            if(doc) {
                self.deleteToken(token, callback);
            } else {
                callback(false);
            }
        })
    }

    private deleteToken(token: string, callback: Function) {
        super.DeleteById(token, function(){
            callback(true);
        })
    }

}