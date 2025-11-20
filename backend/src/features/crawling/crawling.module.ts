// 크롤링 모듈
// 채용 정보 크롤링 기능을 담당합니다

import { Module } from '@nestjs/common';
import { CrawlingController } from './crawling.controller';
import { CrawlingService } from './crawling.service';

@Module({
  controllers: [CrawlingController],
  providers: [CrawlingService],
  exports: [CrawlingService],
})
export class CrawlingModule {}

