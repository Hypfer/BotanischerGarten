import {Service} from "./Service";
import {Group} from "../DataObjects/Group";
/**
 * Created by Hypfer on 09/08/2017.
 */
type GroupCallback = (group : Group) => any;
export class GroupService extends Service {
    protected getCollection(): string {
        return "Groups";
    }

    FindGroup(group : Group, callback: GroupCallback) {
        const self = this;

        super.GetById(group.ID, function(result){
            if(result) {
                callback(new Group(result.ID, result.Type, result.Name, result.MemberIDs));
            } else {
                const newGroup = new Group(group.ID, group.Type, group.Name, group.MemberIDs);
                self.SaveGroup(newGroup, function() {
                    callback(newGroup);
                })
            }
        })
    }

    FindGroupById(id: number, callback : GroupCallback) {
        const self = this;

        super.GetById(id, function(result){
            if(result) {
                callback(new Group(result.ID, result.Type, result.Name, result.MemberIDs))
            } else {
                callback(undefined);
            }
        })
    }

    SaveGroup(group : Group, callback : GroupCallback) {
        super.Save(group.ID, group, callback);
    }
}