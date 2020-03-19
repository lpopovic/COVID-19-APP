const ROOT_URL = '';
const ROOT_URL_API = `${ROOT_URL}/api/`
const withKey = url => `${ROOT_URL_API}${url}`

class RestUrl {
    static templateURL = (test) => withKey(test)
}