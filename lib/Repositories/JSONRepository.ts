import {IRepository} from "./IRepository";
import * as fs from "fs";
import * as merge from "deepmerge";
/**
 * Created by hypfer on 06.06.17.
 */
//DEPRECATED DO NOT USE (unless you're planning to fix this)
export class JSONRepository implements IRepository {
    GetIdsLikeSearchWithLimitAndSkip(collection: string, search: string, limit: number, skip: number, callback: Function) {
        throw new Error("Method not implemented.");
    }

    GetData(fileID: string, callback: Function) {
        throw new Error("Method not implemented.");
    }

    GetRandomIds(collection: string, limit: number, callback: Function) {
        throw new Error("NOT IMPLEMENTED")
    }
    //Ein Singleton!
    private static instance : JSONRepository;
    private StorageLocation : any;
    private Storage : any;

    constructor(JSONRepositoryConfiguration?: any) {
        if(JSONRepository.instance) {
            return JSONRepository.instance;
        }
        JSONRepositoryConfiguration = JSONRepositoryConfiguration ? JSONRepositoryConfiguration : {};
        this.StorageLocation = JSONRepositoryConfiguration.location || "./storage.json";
        if(fs.existsSync(this.StorageLocation)){
            try {
                this.Storage = JSON.parse(fs.readFileSync(this.StorageLocation, 'utf8'));
            } catch(e) {
                console.error(e);
                this.Storage = {};
            }
        } else {
            this.Storage = {};
        }

        JSONRepository.instance = this;
    }


    GetById(collection: string, id: any, callback : Function) {
        if(!(this.Storage[collection])) {
            this.Storage[collection] = {};
        }

        callback(this.Storage[collection][id]);
    }

    GetAllByKeyValue(collection: string, key: string, value: string, callback : Function) {
        throw new Error("Method not implemented.");
    }

    GetAll(collection: string, callback : Function) {
        if(!(this.Storage[collection])) {
            this.Storage[collection] = {};
        }

        callback(this.Storage[collection]);
    }

    Save(collection: string, id: string, entity: any, callback : Function)  {
        if(!(this.Storage[collection])) {
            this.Storage[collection] = {};
        }

        if(this.Storage[collection][id]) {
            this.Storage[collection][id] = merge(this.Storage[collection][id], entity);
        } else {
            this.Storage[collection][id] = entity;
            console.info("Collection '"+collection+"': New Entity '" + id+"'");
        }

        this.SaveFile(callback);
    }

    DeleteById(collection: string, id: string, callback: Function) {
        if(this.Storage[collection][id]) {
            delete this.Storage[collection][id];
            this.SaveFile(callback);
        } else {
            callback();
        }
    }

    GetAllIds(collection: string, callback: Function) {
        if(this.Storage[collection]) {
            callback(Object.keys(this.Storage[collection]));
        } else {
            callback([]);
        }

    }

    private SaveFile(callback : Function) {
        const self = this;
        const stageName = this.StorageLocation+".stage";
        const test = callback;
        fs.writeFile(stageName, JSON.stringify(this.Storage, null, 2), function(err){
            if(!err) {
                fs.rename(stageName, self.StorageLocation, function(err){
                    if(err) {
                        throw err;
                    } else {
                        callback();
                    }
                })
            }
        })
    }
}