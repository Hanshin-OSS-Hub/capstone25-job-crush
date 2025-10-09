# Capstone 25 - Job Crush

Docker 기반의 모노레포 환경으로 구성했습니다. 

## 1. 기술 스택 

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Nest.js, TypeScript
- **DevOps**: Docker, Docker Compose
- **Package Manager**: npm

## 2. 프로젝트 구조

```
/
├── backend/                # Nest.js 백엔드 애플리케이션
│   ├── src/
│   ├── .env.example        # 백엔드 환경변수 템플릿
│   └── Dockerfile
├── frontend/               # Vite + React 프론트엔드 애플리케이션
│   ├── src/
│   ├── .env.example        # 프론트엔드 환경변수 템플릿
│   └── Dockerfile
├── .dockerignore           # Docker 빌드 시 제외할 파일 목록
├── .editorconfig           # 코드 스타일 일관성 설정
├── .gitignore              # Git 버전 관리 제외 파일 목록
├── docker-compose.yml      # 서비스 실행 및 관리를 위한 Docker Compose 설정
└── README.md               # 프로젝트 문서
```

## 3. Docker 개발 환경 

프로젝트의 모든 서비스는 Docker 컨테이너 내부에서 실행됩니다.

- **`docker-compose.yml`**: `frontend`와 `backend` 서비스를 정의하고 오케스트레이션하는 설계도. 포트 매핑, 볼륨 설정 등을 통합 관리합니다.
- **`Dockerfile`**: 각 서비스의 컨테이너 이미지를 생성하기 위한 도커파일. Node.js 환경 구성, 의존성 설치, 실행 명령어 정의 등의 작업을 수행.
- **`Volumes`**: 로컬 소스 코드를 컨테이너 내부와 동기화합니다.

## 4. 시작하기 (Getting Started)

### 4.1. 사전 요구사항

- [Docker Desktop](https://www.docker.com/products/docker-desktop/): 설치 후 반드시 실행 중인 상태여야 한다.
- [Node.js](https://nodejs.org/) & npm: 로컬에 설치를 권장. IDE(VS Code 등)가 코드 자동 완성 및 타입 체크와 같은 기능을 원활하게 제공하기 위해서.

### 4.2. 설치 및 실행

1.  **저장소 클론**

    ```bash
    git clone <저장소_URL>
    cd capstone25-job-crush
    ```

2.  **환경 변수 파일 설정 (필수)**

    각 서비스 폴더의 `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.

    ```bash
    # 백엔드 .env 파일 생성
    cp backend/.env.example backend/.env

    # 프론트엔드 .env 파일 생성
    cp frontend/.env.example frontend/.env
    ```

3.  **Docker 컨테이너 실행**

    프로젝트 루트에서 아래 명령어를 실행하면 이미지를 빌드하고 모든 서비스를 시작합니다.

    ```bash
    docker-compose up --build
    ```

4.  **애플리케이션 접속**
    - **Frontend**: `http://localhost:5173`
    - **Backend**: `http://localhost:3000`

## 5. 환경 변수 (Environment Variables)

`.env` 파일은 민감 정보(API 키, DB 접속 정보 등)를 코드와 분리하기 위해 사용되며, Git에 의해 추적되지 않습니다.

- `backend/.env.example`
  - `PORT`: 백엔드 서버가 실행될 포트
  - `CORS_ORIGIN`: CORS를 허용할 프론트엔드 주소
  - `DATABASE_URL`: 데이터베이스 연결 정보
  - `SOME_API_KEY`: 외부 API 사용 시 필요한 키
- `frontend/.env.example`
  - `VITE_API_BASE_URL`: 프론트엔드에서 호출할 백엔드 API 서버의 기본 주소

## 6. 주요 개발 가이드

### 6.1. 패키지(라이브러리) 설치

새로운 `npm` 패키지를 추가할 때는, **로컬 IDE 인식**과 **Docker 컨테이너 반영** 두 가지를 모두 고려해야 합니다.

1.  **로컬에 의존성 추가**: 먼저, 로컬 `package.json`에 의존성을 추가합니다.

    ```bash
    # 예시: 백엔드에 'class-validator' 패키지 설치
    npm install --prefix backend class-validator
    ```

    - `--prefix <폴더명>`: 현재 위치에서 지정된 폴더로 `npm` 명령을 실행합니다.

2.  **Docker 이미지 리빌드**: `package.json`이 변경되었으므로, 아래 명령어로 이미지를 다시 빌드하여 컨테이너 내부에 새 패키지를 설치합니다.
    ```bash
    docker-compose up --build
    ```

### 6.2. 주요 Docker 명령어

- **전체 서비스 시작**: `docker-compose up`
- **전체 서비스 종료 및 제거**: `docker-compose down`
- **특정 서비스만 빌드/재시작**: `docker-compose up --build <서비스명>` (예: `backend`)
- **컨테이너 내부에서 명령어 실행**: `docker-compose exec <서비스명> <명령어>`
  ```bash
  # 예시: 백엔드 컨테이너에서 테스트 실행
  docker-compose exec backend npm run test
  ```
- **서비스 로그 실시간 확인**: `docker-compose logs -f <서비스명>`
