// src/api/index.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

// 定义接口响应的基础类型
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 请求配置类型
interface RequestConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// 创建请求配置
const config: RequestConfig = {
  baseURL: '192.168.118.105:34567',
  timeout: 500000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// 创建 axios 实例
const request: AxiosInstance = axios.create(config);

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 这里可以添加token等认证信息
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 接口参数类型定义
interface UploadVideoParams {
  url: string;
}

interface QuestionParams {
  prefix: string;
}

interface SummaryParams {
  queryPrefix: string;
  bodyPrefix: string;
}

// 上传视频接口
export const uploadVideo = async (url: string): Promise<ApiResponse> => {
  const params: UploadVideoParams = { url };
  return request({
    url: '/v1/video/push',
    method: 'POST',
    data: params
  });
};

// 获取问题接口
export const getQuestions = async (prefix: string): Promise<ApiResponse> => {
  const params: QuestionParams = { prefix };
  return request({
    url: '/v1/video/question',
    method: 'POST',
    data: params
  });
};

// 获取总结接口
export const getSummary = async (
  queryPrefix: string, 
  bodyPrefix: string
): Promise<ApiResponse> => {
  return request({
    url: '/v1/video/summary',
    method: 'POST',
    params: { prefix: queryPrefix },
    data: { prefix: bodyPrefix }
  });
};

// 上传视频文件接口
export const uploadVideoFile = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  return request({
    url: '/v1/video/raw',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
};