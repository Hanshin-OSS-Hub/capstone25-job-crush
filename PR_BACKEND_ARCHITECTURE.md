# Backend 폴더 구조 및 아키텍처 설계

## 📋 변경사항 요약

### 주요 변경사항

- **기존**: 기본 Nest.js 템플릿 구조 (app.module.ts, app.controller.ts, app.service.ts만 존재)
- **변경**: 기능별 독립 모듈 구조로 전면 재구성
- **목적**: 팀 협업 최적화, 충돌 최소화, 확장성 및 유지보수성 향상

### 변경된 파일 및 폴더

- 신규 폴더 구조 및 기능 모듈 생성
- `main.ts` - 전역 파이프, 필터, 인터셉터, CORS 설정 추가
- `app.module.ts` - 기능 모듈 import 및 전역 모듈 설정

---

## 📁 폴더 구조

```
backend/src/
├── main.ts                    # 엔트리 포인트 (전역 설정)
├── app.module.ts              # 루트 모듈 (모든 모듈 통합)
├── app.controller.ts          # 기본 컨트롤러 (기존 유지)
├── app.service.ts             # 기본 서비스 (기존 유지)
│
├── features/                  # 기능별 모듈 (각자 작업 영역)
│   ├── auth/                 # 인증 담당자 영역
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entities/         # 데이터베이스 엔티티
│   │   ├── guards/           # 인증 가드
│   │   ├── strategies/       # Passport 전략
│   │   └── interfaces/
│   │
│   ├── crawling/             # 크롤링 담당자 영역
│   │   ├── crawling.module.ts
│   │   ├── crawling.controller.ts
│   │   ├── crawling.service.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── interfaces/
│   │   └── utils/
│   │
│   ├── analysis/             # 분석 담당자 영역
│   │   ├── analysis.module.ts
│   │   ├── analysis.controller.ts
│   │   ├── analysis.service.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── services/         # 분석 로직 서비스들
│   │   └── utils/
│   │
│   ├── jobs/                 # 채용 공고 CRUD 담당자 영역
│   │   ├── jobs.module.ts
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   └── interfaces/
│   │
│   ├── applications/         # 지원 현황 담당자 영역
│   │   ├── applications.module.ts
│   │   ├── applications.controller.ts
│   │   ├── applications.service.ts
│   │   ├── dto/
│   │   └── entities/
│   │
│   └── users/                # 사용자 프로필 담당자 영역
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── dto/
│       └── entities/
│
├── shared/                    # 공통 모듈 (모두 사용)
│   ├── decorators/           # 커스텀 데코레이터
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── filters/              # 예외 필터
│   │   └── http-exception.filter.ts
│   ├── interceptors/         # 인터셉터
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── guards/               # 공통 가드
│   │   └── roles.guard.ts
│   ├── pipes/                # 파이프 (유효성 검사)
│   │   └── validation.pipe.ts
│   ├── interfaces/           # 공통 인터페이스
│   │   └── common.interface.ts
│   └── utils/                # 유틸리티 함수
│       └── helpers.ts
│
├── config/                    # 환경 설정 (전역)
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── app.config.ts
│
├── database/                  # 데이터베이스 관련 (전역)
│   ├── database.module.ts
│   ├── migrations/           # 마이그레이션 파일
│   └── seeds/                # 시드 데이터
│
└── types/                     # 전역 타입 정의
    └── index.ts
```

---

## 🔄 작동 원리 및 아키텍처 흐름

### 1. 애플리케이션 초기화 흐름

```
main.ts (엔트리 포인트)
    ↓
전역 설정 적용
    ├── ValidationPipe (유효성 검사)
    ├── HttpExceptionFilter (예외 처리)
    ├── Interceptors (로깅, 응답 변환)
    └── CORS 설정
    ↓
AppModule (루트 모듈)
    ↓
전역 모듈 로드
    ├── ConfigModule (환경 변수)
    └── DatabaseModule (DB 연결)
    ↓
기능 모듈들 로드
    ├── AuthModule
    ├── CrawlingModule
    ├── AnalysisModule
    ├── JobsModule
    ├── ApplicationsModule
    └── UsersModule
    ↓
서버 시작
```

---

### 2. HTTP 요청 처리 흐름

```
HTTP 요청 도착
    ↓
미들웨어 (CORS, Body Parser 등)
    ↓
전역 가드 (인증, 권한 - 있다면)
    ↓
라우트 핸들러 (Controller)
    ↓
전역/라우트 인터셉터 (로깅, 요청 변환)
    ↓
파이프 (DTO 유효성 검사)
    ↓
컨트롤러 메서드 실행
    ↓
서비스 (비즈니스 로직)
    ↓
Repository/Entity (데이터베이스 접근)
    ↓
응답 데이터 반환
    ↓
인터셉터 (응답 변환)
    ↓
필터 (예외 처리)
    ↓
HTTP 응답
```

**상세 예시:**

```typescript
// 1. HTTP 요청: POST /jobs
// 2. Controller
@Controller("jobs")
export class JobsController {
  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }
}

// 3. DTO 유효성 검사 (ValidationPipe)
export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

// 4. Service
@Injectable()
export class JobsService {
  async create(createJobDto: CreateJobDto) {
    // 비즈니스 로직
    return this.jobsRepository.save(createJobDto);
  }
}

// 5. 응답 반환
```

---

### 3. 전역 설정 및 공통 모듈 흐름

#### 전역 모듈 (Global Modules)

**설정 위치: `app.module.ts`**

```typescript
@Module({
  imports: [
    // ✅ 전역 모듈들 - 한 번만 import
    ConfigModule.forRoot({
      isGlobal: true,  // 모든 모듈에서 사용 가능
    }),
    DatabaseModule.forRoot({
      isGlobal: true,  // 모든 모듈에서 DB 사용 가능
    }),

    // ✅ 기능 모듈들
    AuthModule,
    CrawlingModule,
    // ...
  ],
})
```

**특징:**

- `isGlobal: true`로 설정하면 모든 모듈에서 import 없이 사용 가능
- 환경 변수, DB 연결 등 전역 설정에 사용

**사용 예시:**

```typescript
// features/crawling/crawling.service.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config"; // ✅ 전역 모듈

@Injectable()
export class CrawlingService {
  constructor(
    // ✅ ConfigService는 전역이므로 어디서든 사용 가능
    private configService: ConfigService
  ) {}

  async crawl() {
    const apiKey = this.configService.get("CRAWLER_API_KEY");
    // ...
  }
}
```

#### 전역 파이프/필터/인터셉터 (Global Pipes/Filters/Interceptors)

**설정 위치: `main.ts`**

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ 전역 파이프 (유효성 검사)
  app.useGlobalPipes(new ValidationPipe());

  // ✅ 전역 필터 (예외 처리)
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ 전역 인터셉터 (로깅, 응답 변환)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor()
  );

  // ✅ CORS 설정 (전역)
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  });
}
```

**특징:**

- 모든 요청에 자동 적용
- 각 기능 모듈에서 별도 설정 불필요

#### 공통 모듈 (Shared Modules)

**위치: `shared/` 폴더**

**사용 예시:**

```typescript
// features/jobs/jobs.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/shared/guards/jwt-auth.guard"; // ✅ 공통 가드
import { CurrentUser } from "@/shared/decorators/current-user.decorator"; // ✅ 공통 데코레이터

@Controller("jobs")
@UseGuards(JwtAuthGuard) // ✅ 공통 가드 사용
export class JobsController {
  @Get()
  getJobs(@CurrentUser() user: User) {
    // ✅ 공통 데코레이터 사용
    // ...
  }
}
```

---

### 4. 데이터 흐름 및 모듈 간 통신

#### 모듈 간 의존성 주입

```
Feature Module A
    ↓ imports
Feature Module B
    ↓ exports Service
Feature Module A에서 사용
```

**예시:**

```typescript
// features/jobs/jobs.module.ts
@Module({
  imports: [AuthModule], // AuthModule의 Service 사용
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}

// features/jobs/jobs.service.ts
@Injectable()
export class JobsService {
  constructor(
    private authService: AuthService // AuthModule에서 export된 Service 사용
  ) {}
}
```

#### 데이터베이스 접근 흐름

```
Controller
    ↓
Service
    ↓
Repository (TypeORM/Prisma)
    ↓
Database
```

**예시:**

```typescript
// features/jobs/jobs.service.ts
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>
  ) {}

  async findAll() {
    return this.jobsRepository.find();
  }
}
```

---

### 5. 특정 기능 개발 예시: "채용 공고 크롤링" 기능

#### 개발 위치 및 파일

```
1. DTO 정의
   features/crawling/dto/crawl-job.dto.ts
   - CrawlJobDto 인터페이스 정의

2. Service 로직
   features/crawling/crawling.service.ts
   - crawlJobs() 메서드 구현

3. Controller 엔드포인트
   features/crawling/crawling.controller.ts
   - POST /crawling/jobs 엔드포인트 정의

4. Entity 정의
   features/crawling/entities/crawled-job.entity.ts
   - 데이터베이스 엔티티 정의
```

#### 데이터 흐름

```
사용자 또는 스케줄러가 크롤링 요청
    ↓
CrawlingController.crawlJobs() 호출
    ↓
ValidationPipe로 DTO 유효성 검사
    ↓
CrawlingService.crawlJobs() 실행
    ↓
외부 API/웹사이트 크롤링
    ↓
데이터 파싱 및 정제
    ↓
CrawledJob Entity로 변환
    ↓
Database 저장 (Repository)
    ↓
응답 반환
    ↓
TransformInterceptor로 응답 형식 변환
    ↓
HTTP 응답
```

#### 코드 예시

```typescript
// 1. DTO 정의
// features/crawling/dto/crawl-job.dto.ts
export class CrawlJobDto {
  @IsString()
  source: string;

  @IsUrl()
  url: string;
}

// 2. Entity 정의
// features/crawling/entities/crawled-job.entity.ts
@Entity()
export class CrawledJob {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column()
  source: string;
}

// 3. Service 구현
// features/crawling/crawling.service.ts
@Injectable()
export class CrawlingService {
  constructor(
    @InjectRepository(CrawledJob)
    private crawledJobRepository: Repository<CrawledJob>,
    private configService: ConfigService // ✅ 전역 모듈 사용
  ) {}

  async crawlJobs(crawlJobDto: CrawlJobDto) {
    // 크롤링 로직
    const data = await this.fetchData(crawlJobDto.url);

    // 데이터 저장
    const job = this.crawledJobRepository.create({
      title: data.title,
      company: data.company,
      source: crawlJobDto.source,
    });

    return this.crawledJobRepository.save(job);
  }
}

// 4. Controller 구현
// features/crawling/crawling.controller.ts
@Controller("crawling")
export class CrawlingController {
  constructor(private readonly crawlingService: CrawlingService) {}

  @Post("jobs")
  async crawlJobs(@Body() crawlJobDto: CrawlJobDto) {
    return this.crawlingService.crawlJobs(crawlJobDto);
  }
}
```

---

### 6. 전역 설정 vs 로컬 설정 구분

#### 전역으로 묶는 것 (모두 사용)

**위치: `config/`, `shared/`, `database/`**

1. **환경 설정** (`config/`)

   - 데이터베이스 연결 설정
   - JWT 설정
   - 애플리케이션 기본 설정
   - 모든 모듈에서 공유

2. **공통 유틸리티** (`shared/`)

   - 데코레이터 (`@CurrentUser`, `@Roles`)
   - 가드 (`JwtAuthGuard`, `RolesGuard`)
   - 인터셉터 (`LoggingInterceptor`, `TransformInterceptor`)
   - 필터 (`HttpExceptionFilter`)
   - 파이프 (`ValidationPipe`)
   - 유틸리티 함수

3. **데이터베이스** (`database/`)
   - DB 연결 모듈
   - 마이그레이션
   - 시드 데이터

**특징:**

- `isGlobal: true`로 설정하여 모든 모듈에서 사용 가능
- 기능 모듈에서 import 없이 사용 가능
- 변경 시 모든 모듈에 영향

#### 기능별로 분리하는 것 (각자 작업)

**위치: `features/*/`**

1. **비즈니스 로직**

   - 각 기능의 고유 로직
   - 기능 전용 서비스

2. **기능 전용 설정**
   - 크롤링 스케줄러
   - 분석 알고리즘
   - 인증 전략

**특징:**

- 각 담당자가 독립적으로 작업
- 다른 모듈과 충돌 최소화
- 모듈 간 의존성 최소화

#### 사용 예시 비교

```typescript
// ✅ 전역 설정 사용 (어디서든 사용 가능)
// features/crawling/crawling.service.ts
import { ConfigService } from "@nestjs/config"; // 전역 모듈

@Injectable()
export class CrawlingService {
  constructor(private configService: ConfigService) {}

  async crawl() {
    // ✅ 전역 설정 사용
    const apiKey = this.configService.get("CRAWLER_API_KEY");
  }
}

// ✅ 공통 유틸리티 사용
// features/jobs/jobs.controller.ts
import { CurrentUser } from "@/shared/decorators/current-user.decorator";

@Controller("jobs")
export class JobsController {
  @Get()
  getJobs(@CurrentUser() user: User) {
    // ✅ 공통 데코레이터 사용
    // ...
  }
}

// ✅ 기능별 독립 설정
// features/crawling/crawling.scheduler.ts
@Injectable()
export class CrawlingScheduler {
  // ✅ 크롤링 전용 스케줄러
  @Cron("0 0 * * *") // 매일 자정
  async scheduleCrawling() {
    // 크롤링 로직
  }
}
```

---

### 7. 팀 협업 워크플로우

#### 각 담당자 작업 영역

**크롤링 담당자:**

```
features/crawling/ 폴더에서만 작업
- crawling.controller.ts
- crawling.service.ts
- crawling.scheduler.ts
- dto, entities 등
```

**분석 담당자:**

```
features/analysis/ 폴더에서만 작업
- analysis.controller.ts
- analysis.service.ts
- 분석 로직 서비스들
- dto, entities 등
```

**인증 담당자:**

```
features/auth/ 폴더에서만 작업
- auth.controller.ts
- auth.service.ts
- guards, strategies
- dto, entities 등
```

#### 공통 부분 수정 시

```
shared/ 폴더 수정 시
→ 팀 전체 논의 필요
→ PR에 명확히 표시
→ 변경 영향도 설명
```

#### Git 충돌 최소화

- 각 기능 모듈이 독립 폴더에 위치
- 같은 파일을 동시에 수정할 가능성 낮음
- 브랜치 전략과 조합하여 충돌 방지

---

### 8. 에러 처리 흐름

```
예외 발생
    ↓
HttpExceptionFilter (전역 필터)
    ↓
에러 타입 분류
    ├── 400: Bad Request
    ├── 401: Unauthorized
    ├── 403: Forbidden
    ├── 404: Not Found
    └── 500: Internal Server Error
    ↓
에러 응답 형식 변환
    ↓
HTTP 응답 반환
```

**에러 처리 예시:**

```typescript
// shared/filters/http-exception.filter.ts
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
```

---

## 🎯 아키텍처 장점

1. **팀 협업 최적화**: 각 기능 모듈이 독립 폴더에 위치하여 충돌 최소화
2. **확장성**: 새로운 기능 추가 시 해당 feature 폴더만 추가하면 됨
3. **유지보수성**: 기능별로 코드가 분리되어 있어 수정이 용이
4. **재사용성**: 공통 모듈(`shared/`)을 여러 곳에서 재사용 가능
5. **테스트 용이성**: 각 모듈을 독립적으로 테스트 가능
6. **전역 설정 관리**: 환경 설정, DB 연결 등을 한 곳에서 관리

---

## 📝 다음 단계 (TODO)

- [ ] TypeORM 또는 Prisma 설치 및 `database/database.module.ts` 구현
- [ ] Passport JWT 설치 및 인증 전략 구현
- [ ] 각 기능 모듈의 DTO, Entity 구현
- [ ] 크롤링 스케줄러 구현 (NestJS Schedule)
- [ ] 전역 인터셉터 및 필터 구현 활성화
- [ ] 환경 변수 파일 설정 (`.env.example` 업데이트)
- [ ] 테스트 코드 작성

---

## 🔗 관련 파일 참조

- 루트 모듈: `src/app.module.ts`
- 엔트리 포인트: `src/main.ts`
- 전역 설정: `src/config/`
- 공통 모듈: `src/shared/`
- 데이터베이스: `src/database/database.module.ts`
