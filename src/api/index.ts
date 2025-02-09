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
  baseURL: 'http://45.207.211.184:34567',
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

// 1. 上传视频接口
interface UploadVideoData {
  timestamp: string;
}
export const uploadVideo = async (url: string): Promise<ApiResponse<UploadVideoData>> => {
  const params: UploadVideoParams = { url };
  return request({
    url: '/v1/video/push',
    method: 'POST',
    data: params
  });
};

// 2. 获取问题接口
interface QuestionData {
  questions: Array<{
    id: number;
    question: string;
    options: Array<{
      label: string;
      text: string;
    }>;
  }>;
}
export const getQuestions = async (prefix: string): Promise<ApiResponse<QuestionData>> => {
  const params: QuestionParams = { prefix };
  return request({
    url: '/v1/video/question',
    method: 'POST',
    data: params
  });
};

// Summary 接口的数据类型定义
interface Chapter {
  title: string;
  start_time: number;
  end_time: number;
  summary: string;
  keywords: string[];
}

interface SummaryData {
  basic_resp: {
    msg: string;
  };
  summary_info: {
    chapters: Chapter[];
  };
}

// 获取总结接口
export const getSummary = async (prefix: string): Promise<SummaryData> => {
  return request({
    url: '/v1/video/summary',
    method: 'POST',
    data: { prefix }
  });
};

// 4. 上传视频文件接口
interface UploadFileData {
  timestamp: string;
  // 可能还有其他字段
}
export const uploadVideoFile = async (file: File): Promise<ApiResponse<UploadFileData>> => {
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