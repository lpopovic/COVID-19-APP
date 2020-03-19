const ROOT_URL = 'https://hasheet.com';
const ROOT_URL_API = `${ROOT_URL}/api/`
const withKey = url => `${ROOT_URL_API}${url}`

class RestUrl {
    static templateURL = (test) => withKey(test)
    static getTestLocation = () => withKey(`points`)
    static getTestMoreLocations = (latitude, longitude, latitudeDelta, longitudeDelta) => withKey(`points?latitude=${latitude}&longitude=${longitude}&latitudeDelta=${latitudeDelta}&longitudeDelta=${longitudeDelta}`)
}

export { RestUrl }
