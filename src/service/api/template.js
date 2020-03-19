import axios from '../axios'
import { RestUrl } from './url'
class TemplateNetwork {
    static fetchTemplate = () =>
        new Promise(async (resolve, reject) => {
            const url = RestUrl.templateURL()
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
}

export { TemplateNetwork }