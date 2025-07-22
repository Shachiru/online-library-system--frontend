import axios from 'axios'

export const backEndAPI = axios.create({baseURL: 'http://localhost:3000/api'});