import axios from '../axios'
import { RestUrl } from './url'
class TemplateNetwork {


    static fetchTestPoints = () =>
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
    static fetchGetTestPoints = (region) =>
        new Promise(async (resolve, reject) => {

            const latitude = Number(region.latitude).toFixed(6)
            const longitude = Number(region.longitude).toFixed(6)
            const latitudeDelta = Number(region.latitudeDelta).toFixed(6)
            const longitudeDelta = Number(region.longitudeDelta).toFixed(6)
            const url = RestUrl.getTestMoreLocations(latitude, longitude, latitudeDelta, longitudeDelta)
            // try {
            //     const { data } = await axios.get(url)

            //     resolve(data)

            // } catch (error) {
            //     try {
            //         const { message } = error.response.data.error
            //         reject(message)
            //     } catch  {
            //         reject(error.message)

            //     }
            // }
        });
    static fetchPostTestPoints = (coordinate) =>
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

export { TemplateNetwork }