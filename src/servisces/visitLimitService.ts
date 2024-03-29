import {visitsRepository} from "../repositories/visits-repository";
import {Visit, VisitWithIdMongodb} from "../allTypes/visitTypes";
import {FindCursor} from "mongodb";


export const visitLimitService = {
    async checkLimitVisits(IP: string, URL: string, date: Date) {

        const newVisit: Visit = {IP, URL, date}

         await visitsRepository.createVisit(newVisit)


        const visits: FindCursor<Visit> = await visitsRepository.findVisitsByIPAndURL(IP, URL)
        //visits don't have method filter
        const visitsArray: VisitWithIdMongodb[] = await visits.toArray() as VisitWithIdMongodb[] ;

        const timeInterval = 10 * 1000;
        const maxRequests = 5

        const visitsForTimeInterval = visitsArray.filter(
            elem => date.getTime() - elem.date.getTime() < timeInterval)

        if(visitsForTimeInterval.length>maxRequests) return true

        return false
    }
}