import {commentsCollection, usersDevicesCollection} from "../../db/mongoDb";
import {ContentRefreshToken, UsersDevices} from "../../allTypes/usersDevicesTypes";
import {ObjectId, WithId} from "mongodb";


export const usersDevicesRepository = {

    async createDevice(newDevice: UsersDevices) {

        return await usersDevicesCollection.insertOne(newDevice)
    },


    async findDeviceByIdAndDate(result: ContentRefreshToken): Promise<WithId<UsersDevices> | null> {

        const entity = await usersDevicesCollection.findOne({
            deviceId: result.deviceId,
            issuedAt: new Date(result.issuedAtRefreshToken)
        })
        return entity
    },

    async findDeviceById(deviceId: string): Promise<WithId<UsersDevices> | null> {

        const entity = await usersDevicesCollection.findOne({deviceId})
        return entity
    },


    async updateDevice(id: string, issuedAtRefreshToken: Date, expirationRefreshToken: Date) {

        await usersDevicesCollection.updateOne({deviceId: id}, {
            $set: {
                issuedAt: issuedAtRefreshToken,
                expDate: expirationRefreshToken
            }
        })
    },

    async deleteDevicesExeptCurrentDevice(userId: string, deviceId: string) {

        await usersDevicesCollection.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
        });

        return true
    },


    async deleteDevice(deviceId: string) {
        const result = await usersDevicesCollection.deleteOne({deviceId})
        if (result.deletedCount > 0) {

            return true
        } else {
            return false
        }

    }

}