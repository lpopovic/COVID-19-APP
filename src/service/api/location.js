import axios from '../axios'
import { RestUrl } from './url'
import { Location } from '../../model/location';
import { STORAGE_KEY, getStorageData, saveStorageData, strings } from '../../helper'
class LocationNetwork {

    static fetchGetPointsForRegion = (region, radius) =>
        new Promise(async (resolve, reject) => {

            const latitude = Number(region.latitude).toFixed(6)
            const longitude = Number(region.longitude).toFixed(6)

            const url = RestUrl.getMoreLocations(latitude, longitude, radius)
            try {
                const { data } = await axios.get(url)

                const object = Location.createArrayObjects(data.data)

                resolve(object)



            } catch (error) {
                resolve(strings.errorText)
                // try {
                //     const { message } = error.response.data.error
                //     reject(message)
                // } catch  {
                //     reject(error.message)

                // }
            }
        });

    static fetchGetPointsInsertByUser = (uuid) =>
        new Promise(async (resolve, reject) => {

            const url = RestUrl.getMyInsertLocations(uuid)
            try {
                const { data } = await axios.get(url)

                const object = Location.createArrayObjects(data.data)

                resolve(object)

            } catch (error) {
                resolve(strings.errorText)
                // try {
                //     const { message } = error.response.data.error
                //     reject(message)
                // } catch  {
                //     reject(error.message)

                // }
            }
        });
    static fetchPostCreateNewPoint = (coordinate) =>
        new Promise(async (resolve, reject) => {
            const url = RestUrl.postLocation
            const latitude = Number(coordinate.latitude).toFixed(6)
            const longitude = Number(coordinate.longitude).toFixed(6)
            const uuid = await getStorageData(STORAGE_KEY.UUID_APP)
            let formData = null
            if (uuid !== null) {
                formData = {
                    latitude,
                    longitude,
                    uuid,
                }
            } else {
                formData = {
                    latitude,
                    longitude,

                }
            }

            try {
                const { data } = await axios.post(url, formData)
                if (data.data.uuid) {
                    saveStorageData(data.data.uuid, STORAGE_KEY.UUID_APP)
                }
                resolve(String(data.message))

            } catch (error) {
                resolve(strings.errorText)
                // try {
                //     const { message } = error.response.data.error
                //     reject(message)
                // } catch  {
                //     reject(error.message)

                // }
            }
        });
    static fetchDeleteRemovePoint = (coordinate) =>
        new Promise(async (resolve, reject) => {

            const latitude = Number(coordinate.latitude).toFixed(6)
            const longitude = Number(coordinate.longitude).toFixed(6)
            const uuid = await getStorageData(STORAGE_KEY.UUID_APP)
            let formData = {
                latitude,
                longitude,
                // uuid,
            }
            const url = RestUrl.deleteMyInsertLocation(uuid)
            try {
                const { data } = await axios.post(url,formData)

                resolve(String(data.message))

            } catch (error) {
                // try {
                //     const { message } = error.response.data.error
                //     reject(message)
                // } catch  {
                //     reject(error.message)

                // }
                resolve(strings.errorText)
            }
        });
}

export { LocationNetwork }