import axios from 'axios'

const request = axios.create({
  // 指定请求时候的根路径
  baseURL: 'http://geek.itheima.net'
})

export default request
