import {usersDevicesCollection} from "../db/mongoDb";
import {UsersDevices} from "../allTypes/usersDevicesTypes";


export const usersDevicesRepository = {

    async createDevice(newDevice: UsersDevices){

        return await usersDevicesCollection.insertOne(newDevice)
    }
}