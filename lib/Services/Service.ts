import {MongoRepository} from "../Repositories/MongoRepository";
/**
 * Created by hypfer on 06.06.17.
 */
export abstract class Service {
    Repository : MongoRepository;
    Collection : string;
    constructor(repository : MongoRepository) {
        this.Repository = repository;
        this.Collection = this.getCollection();
    }
    protected abstract getCollection() : string;

    protected GetById(id : string, callback : Function) {
        this.Repository.GetById(this.Collection, id, callback);
    };
    protected GetByDbId(id : string, callback : Function) {
        this.Repository.GetByDbId(this.Collection, id, callback);
    };
    protected GetPreviousAndNextByDbId(id: string, condition : any, callback: Function) {
        this.Repository.GetPreviousAndNextByDbId(this.Collection, id, condition, callback);
    }
    protected GetFirstAndLastId(condition: any, callback : Function) {
        this.Repository.GetFirstAndLastId(this.Collection, condition, callback);
    }
    /*protected GetAllByKeyValue( key: string, value: string, callback : Function) {
        this.Repository.GetAllByKeyValue(this.Collection, key, value, callback);
    };
    protected GetAll(callback : Function) {
        this.Repository.GetAll(this.Collection, callback);
    }; */
    protected Save(id: string, entity : any, callback : Function) {
        this.Repository.Save(this.Collection, id, entity, callback);
    }; //upsert
    protected DeleteById(id : string, callback : Function) {
        this.Repository.DeleteById(this.Collection, id, callback);
    }
    GetAllIds(callback : Function) {
        this.Repository.GetAllIds(this.Collection, callback);
    }
    GetRandomIds(limit : number, condition : any, callback : Function) {
        this.Repository.GetRandomIds(this.Collection, limit, condition, callback);
    }
    GetIdsLikeSearchWithLimitAndSkip(search: string, limit : number, skip : number, callback : Function) {
        this.Repository.GetIdsLikeSearchWithLimitAndSkip(this.Collection, search, limit, skip, callback);
    };
}