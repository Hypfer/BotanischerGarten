/**
 * Created by hypfer on 06.06.17.
 */
export interface IRepository {
    GetById(collection: string, id : string, callback : Function);
    GetByDbId(collection: string, id: string, callback: Function);
    GetPreviousAndNextByDbId(collection: string, id: string, condition : any, callback: Function);
    /*GetAllByKeyValue(collection: string, key: string, value: string, callback : Function);
    GetAll(collection: string, callback : Function); */
    Save(collection: string, id: string, entity : any, callback : Function); //upsert
    DeleteById(collection: string, id: string, callback : Function);
    GetAllIds(collection: string, callback : Function);
    GetRandomIds(collection : string, limit : number, condition : any, callback : Function);
    GetIdsLikeSearchWithLimitAndSkip(collection: string, search: string, limit : number, skip:number, callback : Function);
    GetData(fileID : string, callback : Function);
}