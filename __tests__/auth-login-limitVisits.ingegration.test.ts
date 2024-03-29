import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {authService} from "../src/servisces/auth-service";
import {createItemsForTest} from "./utils/createItemsForTest";
import {ObjectId} from "mongodb";
import {emailAdapter} from "../src/adapters/emailAdapter";
import {STATUS_CODE} from "../src/common/constant-status-code";
import {visitLimitService} from "../src/servisces/visitLimitService";


const  req = supertest(app)

describe('limit visits for login',()=>{

    beforeAll(async ()=>{
        await req
            .delete ('/testing/all-data')
    })

const visitLimitMethod = visitLimitService.checkLimitVisits;

const IP = '1111'
    const URL='12345'
    const date = new Date()

    it("limit visits for login",async ()=>{
        const result1 = await visitLimitMethod(IP, URL, date)
        const result2 = await visitLimitMethod(IP, URL, date)
        const result3 = await visitLimitMethod(IP, URL, date)
        const result4 = await visitLimitMethod(IP, URL, date)
        const result5 = await visitLimitMethod(IP, URL, date)
        const result6 = await visitLimitMethod(IP, URL, date)

        //return error 429 if  more than  5 request  during  10sec

        expect(result1).toEqual(false)
        expect(result5).toEqual(false)
        expect(result6).toEqual(true)
    })



})
