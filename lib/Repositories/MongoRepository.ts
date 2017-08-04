import {IRepository} from "./IRepository";
import * as mongo from "mongodb";
import {Db, MongoClient, ObjectID} from "mongodb";
import * as Grid from "gridfs";
/**
 * Created by hypfer on 08.06.17.
 */
export class MongoRepository implements IRepository {
    Config : any;
    DB : Db;
    GFS : Grid;
    constructor(config : any, callback : Function) {
        const self = this;

        this.Config = config;
        if(!this.Config.mongodb.url) {
            throw new Error("Missing 'mongodb.url' in config");
        }
        MongoClient.connect(this.Config.mongodb.url, function(err, db){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            self.DB = db;
            self.GFS = Grid(self.DB, mongo);
            callback()
        })
    }

    GetById(collection: string, id: string, callback: Function) {
        const self = this;
        const _collection = this.DB.collection(collection);

        _collection.findOne({id: id}, function(err, doc){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            if(doc) {
                /*

                 if(doc["GFS_id"]) {
                 console.log("Entity has GFS_id. Fetching from GFS");
                 self.GFS.readFile({_id: doc["GFS_id"]}, function(err, data){
                 if(err) {
                 throw new Error(JSON.stringify(err));
                 }
                 doc["DataStreamHex"] = data.toString();

                 callback(doc);
                 });
                 } else {
                 callback(doc);
                 } */
                callback(doc);
            } else {
                callback(doc);
            }
        });
    }
    GetByDbId(collection: string, id: string, callback: Function) {
        const self = this;
        const _collection = this.DB.collection(collection);

        _collection.findOne({_id: new ObjectID(id)}, function(err, doc){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            if(doc) {
                /*

                 if(doc["GFS_id"]) {
                 console.log("Entity has GFS_id. Fetching from GFS");
                 self.GFS.readFile({_id: doc["GFS_id"]}, function(err, data){
                 if(err) {
                 throw new Error(JSON.stringify(err));
                 }
                 doc["DataStreamHex"] = data.toString();

                 callback(doc);
                 });
                 } else {
                 callback(doc);
                 } */
                callback(doc);
            } else {
                callback(doc);
            }
        });
    }

    GetPreviousAndNextByDbId(collection: string, id: string, callback: Function) {
        const self = this;
        const _collection = this.DB.collection(collection);
        const returnObj = {
            prev: undefined,
            next: undefined
        };
        //prev
        _collection.find({"_id" : {"$lt": new ObjectID(id)}}).sort({"_id": -1}).limit(1).toArray(function(err, docs){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            if(docs.length > 0) {
                returnObj.prev = docs[0];
            }
            _collection.find({"_id" : {"$gt": new ObjectID(id)}}).sort({"_id" : 1}).limit(1).toArray(function(err, docs){
                if(err) {
                    throw new Error(JSON.stringify(err));
                }
                if(docs.length > 0) {
                    returnObj.next = docs[0];
                }

                callback(returnObj);
            })
        })

    }

    /*GetAllByKeyValue(collection: string, key: string, value: string, callback: Function) {
        const _collection = this.DB.collection(collection);

        const query = {};
        query[key] = value;

        _collection.find(query).toArray(function(err,docs){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            callback(docs);
        });
    }*/

    /*GetAll(collection: string, callback: Function) {
        const _collection = this.DB.collection(collection);

        _collection.find().toArray(function(err,docs){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            callback(docs);
        });
    }*/

    Save(collection: string, id: string, entity: any, callback: Function) {
        const _collection = this.DB.collection(collection);

        entity["id"] = id;
        if(entity["DataStreamHex"]){
            console.log("Entity has DataStream. Saving to GFS.");
            this.GFS.writeFile({filename: entity.id}, entity["DataStreamHex"], function(err,file){
                if(err) {
                    throw new Error(JSON.stringify(err));
                }
                delete entity["DataStreamHex"];
                entity["DataStreamInternalID"] = file._id;
                doSave();
            })
        } else {
            doSave();
        }

        function doSave() {
            _collection.updateOne({id: id},entity,{upsert:true, w:1}, function(err, doc){
                if(err) {
                    throw new Error(JSON.stringify(err));
                }
                callback(doc);
            });
        }
    }

    DeleteById(collection: string, id: string, callback: Function) {
        const self = this;
        const _collection = this.DB.collection(collection);

        _collection.findOneAndDelete({id: id}, function(err,doc){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            if(doc && doc.value && doc.value["DataStreamInternalID"]) {
                self.GFS.remove({_id : doc.value["DataStreamInternalID"]}, function(err){
                    if(err) {
                        throw new Error(JSON.stringify(err));
                    }
                    callback();
                })
            } else {
                callback();
            }
        });
    }

    GetAllIds(collection: string, callback: Function) {
        const _collection = this.DB.collection(collection);

        _collection.find().project({id : 1}).toArray(function(err,docs){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            const returnArr = [];
            docs.forEach(function(doc){
                returnArr.push(doc.id);
            });
            callback(returnArr);
        });
    }

    GetRandomIds(collection: string, limit: number, callback: Function) {
        const _collection = this.DB.collection(collection);

        _collection.aggregate([
            { $sample: { size: limit } },
            { $project: {id : 1, _id : 0}}
            ]).toArray(function(err,docs){
                if(err) {
                    throw new Error(JSON.stringify(err));
                }
                const returnArr = [];
                docs.forEach(function(doc){
                    returnArr.push(doc.id);
                });
                callback(returnArr);
        });
    }

    GetIdsLikeSearchWithLimitAndSkip(collection: string, search: string,
                                        limit: number, skip : number, callback: Function) {
        const _collection = this.DB.collection(collection);

        _collection.find({id : new RegExp(search, "i")}).skip(skip).limit(limit).toArray(function(err,docs){
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            const returnArr = [];
            docs.forEach(function(doc){
                returnArr.push(doc.id);
            });
            callback(returnArr);
        });
    }

    GetData(fileID: string, callback: Function) {
        this.GFS.readFile({_id : fileID}, function(err, data){
            if(err) {
                throw new Error(JSON.stringify(err))
            }
            callback(data.toString());
        })
    }

}