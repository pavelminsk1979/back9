import {Visit} from "../allTypes/visitTypes";
import {visitsCollection} from "../db/mongoDb";
import {FindCursor, InsertOneResult} from "mongodb";


export const visitsRepository = {

    async createVisit(newVisit:Visit):Promise<InsertOneResult<Visit>>{
        return  await visitsCollection.insertOne(newVisit)
    },



    async findVisitsByIPAndURL (IP:string,URL:string): Promise<FindCursor <Visit>>{
        return await visitsCollection.find({IP,URL})
    },

}


