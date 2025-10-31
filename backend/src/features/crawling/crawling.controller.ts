// 크롤링 컨트롤러
// 크롤링 관련 API 엔드포인트를 정의합니다

import { Controller, Post, Get } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

@Controller('crawling')
export class CrawlingController {
  constructor(private readonly crawlingService: CrawlingService) {}

  // TODO: 크롤링 로직 구현
  // @Post('start')
  // async startCrawling() {
  //   return this.crawlingService.startCrawling();
  // }
}

