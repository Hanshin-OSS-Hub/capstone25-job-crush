// [필수 1] NestJS 핵심 모듈 가져오기
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// [필수 2] App 컨트롤러 & 서비스 가져오기
import { AppController } from './app.controller';
import { AppService } from './app.service';

// [필수 3] 기능(Feature) 모듈 가져오기
// (경로가 정확해야 합니다. 폴더 구조에 맞춰 작성했습니다.)
import { AuthModule } from './features/auth/auth.module';
import { CrawlingModule } from './features/crawling/crawling.module';
import { AnalysisModule } from './features/analysis/analysis.module';
import { JobsModule } from './features/jobs/jobs.module';
import { ApplicationsModule } from './features/applications/applications.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    // 전역 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigModule을 사용할 수 있게 설정
      envFilePath: ['.env.local', '.env'],
    }),
    
    // DatabaseModule.forRoot({ isGlobal: true }), // TODO: DB 설정 후 활성화

    // 기능 모듈들
    // (주의: 만약 아직 파일을 안 만든 모듈이 있다면 주석 처리 해야 에러가 안 납니다!)
    AuthModule,
    CrawlingModule,
    AnalysisModule,
    JobsModule,
    ApplicationsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}