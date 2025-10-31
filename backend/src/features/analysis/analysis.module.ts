// 분석 모듈
// 채용 정보 분석 기능을 담당합니다

import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}

