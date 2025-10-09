# 1. 베이스 이미지 설정 (Node.js 20)
FROM node:20-alpine

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 애플리케이션 실행 (개발 모드)
CMD ["npm", "run", "start:dev"]
