import {ContentRefreshToken, UsersDevices} from "../allTypes/usersDevicesTypes";
import {tokenJwtServise} from "./token-jwt-service";
import {WithId} from "mongodb";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";
import {usersDevicesQueryRepository} from "../repositories/usersDevices/usersDevices-query-repository";


export const securityDevicesService={

    async getActiveDevices(refreshToken:string){

        const result :ContentRefreshToken|null =  await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if(!result) return null

        const device:WithId<UsersDevices>|null = await usersDevicesRepository.findDeviceByIdAndDate(result)

        if(!device) return null

        const devicesOneUser = await usersDevicesQueryRepository.getDevices(device.userId)


        return devicesOneUser

    }

}