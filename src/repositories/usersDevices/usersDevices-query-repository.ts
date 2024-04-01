import {usersDevicesCollection} from "../../db/mongoDb";
import {deviceMaper} from "../../mapers/deviceMaper";


export const usersDevicesQueryRepository = {

    async getDevices(userId: string) {

        const devices = await usersDevicesCollection.find({userId})

        const arrayDevices = await devices.toArray()

        return arrayDevices.map(deviceMaper)
    },

    async deleteDevicesExeptCurrentDevice(userId: string, deviceId: string) {
        debugger
        await usersDevicesCollection.deleteMany({
            userId: userId,
            deviceId: {$ne: deviceId}
        });
        debugger
        return true
    }

}