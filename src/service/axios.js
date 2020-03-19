import axios from 'axios';


const fetch = axios.create({
    timeout:10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})


export default fetch 