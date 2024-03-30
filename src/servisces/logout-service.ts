import {ContentRefreshToken, UsersDevices} from "../allTypes/usersDevicesTypes";
import {tokenJwtServise} from "./token-jwt-service";
import {WithId} from "mongodb";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";


export const logoutService = {

    async logout(refreshToken:string){

        const result :ContentRefreshToken|null =  await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if(!result) return null

         await usersDevicesRepository.deleteDevice(result.deviceId)

        return true

    }
}