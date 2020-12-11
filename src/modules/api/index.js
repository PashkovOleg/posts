import axios from 'axios'


const BASE_API_URL = process.env.VUE_APP_REST_API_URL || 'http://jsonplaceholder.typicode.com/'
const client = axios.create({
  baseURL: BASE_API_URL
})


export default client