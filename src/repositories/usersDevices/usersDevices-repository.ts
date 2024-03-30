import {commentsCollection, usersDevicesCollection} from "../../db/mongoDb";
import {ContentRefreshToken, UsersDevices} from "../../allTypes/usersDevicesTypes";
import {ObjectId, WithId} from "mongodb";


export const usersDevicesRepository = {

    async createDevice(newDevice: UsersDevices){

        return await usersDevicesCollection.insertOne(newDevice)
    },


    async findDeviceByIdAndDate(result: ContentRefreshToken):Promise<WithId<UsersDevices>|null> {

        const entity = await usersDevicesCollection.findOne({
            deviceId:result.deviceId,
            issuedAt:result.issuedAtRefreshToken
        })
        return entity
    },


    async updateDevice(id:string,issuedAtRefreshToken:Date,expirationRefreshToken:Date){

        await usersDevicesCollection.updateOne({deviceId:id},{
            $set:{
                issuedAt:issuedAtRefreshToken,
                expDate:expirationRefreshToken}
        })
    },

    async deleteDevice(deviceId:string){
        await usersDevicesCollection.deleteOne({deviceId})

    }

}