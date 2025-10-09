import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigModule을 사용할 수 있게 설정
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
