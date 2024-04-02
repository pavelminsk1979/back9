import {ContentRefreshToken, UsersDevices} from "../allTypes/usersDevicesTypes";
import {tokenJwtServise} from "./token-jwt-service";
import {WithId} from "mongodb";
import {usersDevicesRepository} from "../repositories/usersDevices/usersDevices-repository";
import {usersDevicesQueryRepository} from "../repositories/usersDevices/usersDevices-query-repository";
import {ResultCode} from "../common/object-result";


export const securityDevicesService = {

    async getActiveDevices(refreshToken: string) {

        const result: ContentRefreshToken | null = await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if (!result) return null

        const device: WithId<UsersDevices> | null = await usersDevicesRepository.findDeviceByIdAndDate(result)

        if (!device) return null

        const devicesOneUser = await usersDevicesQueryRepository.getDevices(device.userId)


        return devicesOneUser
    },


    async deleteNotActiveDevices(refreshToken: string) {

        const result: ContentRefreshToken | null = await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if (!result) return null

        const device: WithId<UsersDevices> | null = await usersDevicesRepository.findDeviceByIdAndDate(result)

        if (!device) return null

        await usersDevicesRepository.deleteDevicesExeptCurrentDevice(device.userId, device.deviceId)


        return true
    },

    async deleteDeviceById(deviceId: string, refreshToken: string) {

        const isExistDeviceInCollection = await usersDevicesRepository.findDeviceById(deviceId)

        if (!isExistDeviceInCollection) return {
            code: ResultCode.Failure
        }

        const result: ContentRefreshToken | null = await tokenJwtServise.getDataFromRefreshToken(refreshToken)

        if (!result) return {
            code: ResultCode.Incorrect
        }

        if (deviceId !== result.deviceId) return {
            code: ResultCode.Success
        }

     /*   if (deviceId !== result.deviceId) return {
            code: ResultCode.NotFound
        }*/

        const isDelete: boolean = await usersDevicesRepository.deleteDeviceById(deviceId)

        if (isDelete) return {code: ResultCode.Success}

        return {code: ResultCode.NotFound}


    }

}