import axios from 'axios'
import store from '@/store'
import {getToken} from "@/utils/auth";
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API ?? 'https://wfs.globalart.dev/api',
  //withCredentials: true
  // timeout: 30000
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.response === false) {
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  },
  error => {
    if (error.response.status === 401) {
      // alert(getRefreshToken())
    } else {
      return Promise.reject(error)
    }
  }
)

export default service
