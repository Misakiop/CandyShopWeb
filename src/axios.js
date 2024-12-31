import axios from 'axios';
import { getToken } from "./composables/auth";

const service = axios.create({
  baseURL: "http://121.40.60.41:8080",
  withCredentials: true // 确保在跨域请求中发送 Cookie 121.40.60.41
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {

  //往header头自动添加token
  const token = getToken()
  if(token){
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data.code === 200) {
    return response.data;
  } else {
    // 如果不是 200，抛出一个错误
    const error = new Error(response.data.msg || '请求失败');
    error.response = response;
    throw error;
  }
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response && error.response.data && error.response.data.msg) {
    error.message = error.response.data.msg;
  }
  return Promise.reject(error);
});

export default service;