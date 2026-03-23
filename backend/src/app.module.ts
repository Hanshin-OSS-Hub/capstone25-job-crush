import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

// 기능 모듈들
import { AuthModule } from './features/auth/auth.module';
import { CrawlingModule } from './features/crawling/crawling.module';
import { AnalysisModule } from './features/analysis/analysis.module';
import { JobsModule } from './features/jobs/jobs.module';
import { ApplicationsModule } from './features/applications/applications.module';
import { UsersModule } from './features/users/users.module';

// 전역 모듈들
// import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    // 전역 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigModule을 사용할 수 있게 설정
      envFilePath: ['.env.local', '.env'],
    }),
    // 분석 API 등 @UseGuards(ThrottlerGuard)가 붙은 라우트에만 적용 (전역 가드 아님)
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 5,
      },
    ]),
    // DatabaseModule.forRoot({ isGlobal: true }), // TODO: DB 설정 후 활성화

    // 기능 모듈들
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
export class AppModule { }
