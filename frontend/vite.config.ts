import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 접속 허용 (Docker 환경 필수)
    proxy: {
      // '/api'로 시작하는 요청을 백엔드(3000번 포트)로 보냄
      "/api": {
        // Docker Compose 환경에서는 'backend' 서비스명을 사용해야 함
        // (프론트엔드 컨테이너 입장에서는 localhost가 아니라 backend 컨테이너)
        target: "http://backend:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // /api/analysis -> /analysis 로 변환
      },
    },
  },
});
