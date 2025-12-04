// API 엔드포인트 상수 정의
// API 경로를 문자열로 직접 사용하는 것을 방지하고 중앙에서 관리합니다
// 베이스 URL은 api/client.ts에서 관리되며, 여기서는 경로만 정의합니다

export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  
  // 채용 공고 관련
  JOBS: {
    BASE: '/jobs',
    BY_ID: (id: string | number) => `/jobs/${id}`,
    SEARCH: '/jobs/search',
    APPLY: (id: string | number) => `/jobs/${id}/apply`,
  },
  
  // 크롤링 관련
  CRAWLING: {
    BASE: '/crawling',
    START: '/crawling/start',
    STATUS: '/crawling/status',
  },
  
  // 분석 관련
  ANALYSIS: {
    BASE: '/analysis',
    TRENDS: '/analysis/trends',
    SALARY: '/analysis/salary',
  },
  
  // 지원 현황 관련
  APPLICATIONS: {
    BASE: '/applications',
    BY_ID: (id: string | number) => `/applications/${id}`,
    BY_USER: (userId: string) => `/applications/user/${userId}`,
  },

  // 면접 관련
  INTERVIEWS: {
    SESSIONS: '/interviews/sessions',
    SESSION_BY_ID: (sessionId: string) => `/interviews/sessions/${sessionId}`,
    SESSION_EVALUATION: (sessionId: string) => `/interviews/sessions/${sessionId}/evaluation`,
  },
  
  // 사용자 관련
  USERS: {
    BASE: '/users',
    BY_ID: (id: string | number) => `/users/${id}`,
    PROFILE: (id: string | number) => `/users/${id}/profile`,
    UPDATE_PROFILE: (id: string | number) => `/users/${id}/profile`,
  },
} as const;

