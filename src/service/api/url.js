const ROOT_URL = 'https://hasheet.com';
const ROOT_URL_API = `${ROOT_URL}/api/`
const withKey = url => `${ROOT_URL_API}${url}`

class RestUrl {
    static templateURL = (test) => withKey(test)
    static postLocation = withKey(`points`)
    static getMoreLocations = (latitude, longitude, radius) => withKey(`points?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
    static getMyInsertLocations = (uuid) => withKey(`uuid/${uuid}/points`)
    static deleteMyInsertLocation = (uuid) => withKey(`uuid/${uuid}/delete-point`)
}

export { RestUrl }