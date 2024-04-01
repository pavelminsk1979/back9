import {agent as supertest} from "supertest";
import {app} from "../src/settings";
import {STATUS_CODE} from "../src/common/constant-status-code";


const req = supertest(app)

describe('securityDevices', () => {

    beforeAll(async () => {
        await req
            .delete('/testing/all-data')
    })


    const loginPasswordBasic64 = 'YWRtaW46cXdlcnR5'
    const loginNewUser = '4321234'
    const passwordNewUser = '98766YUI'
    const emailNewUser = 'pavel@mail.ru'


    it('POST create newUsers', async () => {
        const res = await req
            .post('/users')
            .set('Authorization', `Basic ${loginPasswordBasic64}`)
            .send({
                login: loginNewUser,
                password: passwordNewUser,
                email: emailNewUser
            })
            .expect(STATUS_CODE.CREATED_201)

        expect(res.body.login).toEqual(loginNewUser)
        expect(res.body.email).toEqual(emailNewUser)
    })


    let refreshTokenFIRST: string;

    it("create entity first", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .set('user-agent', 'FIRSTLaptop')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenFIRST = allCookies[0].split(';')[0].split('=')[1];
        //console.log('refreshTokenFIRST'+refreshTokenFIRST);

    })


    let refreshTokenSecond: string;

    it("create entity second", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .set('user-agent', 'SecondLaptop')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenSecond = allCookies[0].split(';')[0].split('=')[1];


    })


    let refreshTokenThird: string;

    it("create entity third", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .set('user-agent', 'ThirdLaptop')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenThird = allCookies[0].split(';')[0].split('=')[1];


    })


    it("get devices one user", async () => {
        const res = await req
            .get('/security/devices')
            .set('Cookie', `refreshToken=${refreshTokenFIRST}`)

            .expect(STATUS_CODE.SUCCESS_200)
        //console.log(res.body)

    })


    it("delete all devices exept current device", async () => {
         await req
            .delete('/security/devices')
            .set('Cookie', `refreshToken=${refreshTokenThird}`)

            .expect(STATUS_CODE.NO_CONTENT_204)

    })


    let refreshTokenFourth: string;

    it("create entity fourth", async () => {
        const res = await req
            .post('/auth/login')
            .send({
                loginOrEmail: loginNewUser,
                password: passwordNewUser
            })
            .set('user-agent', 'FourthLaptop')
            .expect(STATUS_CODE.SUCCESS_200)


        const allCookies = res.headers['set-cookie'];
        refreshTokenFourth = allCookies[0].split(';')[0].split('=')[1];

    })




})