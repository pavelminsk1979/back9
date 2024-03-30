import {Response, Router} from "express";
import {STATUS_CODE} from "../common/constant-status-code";
import {securityDevicesService} from "../servisces/securityDevices-service";



export const securityDevicesRoute = Router({})

securityDevicesRoute.get('/devices', async (req: any, res: Response) => {
    try {
        debugger
        const refreshToken = req.cookies.refreshToken

        const devices = securityDevicesService.getActiveDevices(refreshToken)

        if (devices) {
            debugger

            res.status(STATUS_CODE.SUCCESS_200).send(devices)

        } else {
            res.sendStatus(STATUS_CODE.UNAUTHORIZED_401)
        }

    }catch (error){
        console.log('securityDevices-route.ts /devices' + error)
        res.sendStatus(STATUS_CODE.SERVER_ERROR_500)
    }

})