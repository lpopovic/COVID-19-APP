import axios from '../axios'
import { RestUrl } from './url'
class LocationNetwork {


    static fetchGetAllPoints = () =>
        new Promise(async (resolve, reject) => {
            const url = RestUrl.getTestLocation("")

            try {
                const { data } = await axios.get(url)

                resolve(data)

            } catch (error) {
                try {
                    const { message } = error.response.data.error
                    reject(message)
                } catch  {
                    reject(error.message)

                }
            }
        });
    static fetchGetPointsForRegion = (region, radius) =>
        new Promise(async (resolve, reject) => {

            const latitude = Number(region.latitude).toFixed(6)
            const longitude = Number(region.longitude).toFixed(6)

            const url = RestUrl.getTestMoreLocations(latitude, longitude, radius)
            try {
                const { data } = await axios.get(url)

                const object = data.data.map(item => {

                    const longitude = Number(item.longitude)
                    const latitude = Number(item.latitude)
                    const weight = 1
                    return {
                        longitude,
                        latitude,
                        weight,
                    };

                })

                resolve(object)
            


            } catch (error) {
                try {
                    const { message } = error.response.data.error
                    reject(message)
                } catch  {
                    reject(error.message)

                }
            }
        });
    static fetchPostCreateNewPoint = (coordinate) =>
        new Promise(async (resolve, reject) => {
            const url = RestUrl.getTestLocation("")
            const latitude = Number(coordinate.latitude).toFixed(6)
            const longitude = Number(coordinate.longitude).toFixed(6)
            let formData = {
                latitude,
                longitude,
            }
            try {
                const { data } = await axios.post(url, formData)

                resolve(data)

            } catch (error) {
                try {
                    const { message } = error.response.data.error
                    reject(message)
                } catch  {
                    reject(error.message)

                }
            }
        });
}

export { LocationNetwork }