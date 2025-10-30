// 분석 컨트롤러
// 분석 관련 API 엔드포인트를 정의합니다

import { Controller, Get } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // TODO: 분석 로직 구현
  // @Get('trends')
  // async getTrends() {
  //   return this.analysisService.getTrends();
  // }
}

