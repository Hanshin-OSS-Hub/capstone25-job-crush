// API 클라이언트 설정 파일
// 전역 API 베이스 URL과 Axios 인스턴스를 설정합니다
// 모든 API 호출은 이 클라이언트를 통해 이루어지며, 베이스 URL은 환경 변수로 관리됩니다

// TODO: Axios 설치 후 주석 해제
// import axios from 'axios';
// import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 전역 API 베이스 URL 설정
// 환경 변수 VITE_API_BASE_URL이 설정되어 있으면 사용하고, 없으면 기본값 사용
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Axios 인스턴스 생성 (전역 설정)
// export const apiClient: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000, // 10초 타임아웃
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// 요청 인터셉터 (모든 요청 전에 실행)
// apiClient.interceptors.request.use(
//   (config) => {
//     // 로컬 스토리지에서 토큰 가져오기
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 응답 인터셉터 (모든 응답 후에 실행)
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     // 성공 응답 처리
//     return response;
//   },
//   (error) => {
//     // 에러 응답 처리
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 인증 에러 - 토큰 제거 및 로그인 페이지로 리다이렉트
//           localStorage.removeItem('accessToken');
//           window.location.href = '/login';
//           break;
//         case 403:
//           // 권한 에러
//           console.error('권한이 없습니다.');
//           break;
//         case 404:
//           // 리소스를 찾을 수 없음
//           console.error('리소스를 찾을 수 없습니다.');
//           break;
//         case 500:
//           // 서버 에러
//           console.error('서버 에러가 발생했습니다.');
//           break;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// 타입 정의 (Axios 설치 전에도 사용 가능)
export interface ApiClient {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

// 임시 구현 (Axios 설치 전 사용)
export const apiClient = {
  get: async (url: string) => {
    throw new Error('Axios를 설치해주세요. npm install axios');
  },
  post: async (url: string) => {
    throw new Error('Axios를 설치해주세요. npm install axios');
  },
  put: async (url: string) => {
    throw new Error('Axios를 설치해주세요. npm install axios');
  },
  patch: async (url: string) => {
    throw new Error('Axios를 설치해주세요. npm install axios');
  },
  delete: async (url: string) => {
    throw new Error('Axios를 설치해주세요. npm install axios');
  },
} as ApiClient;

