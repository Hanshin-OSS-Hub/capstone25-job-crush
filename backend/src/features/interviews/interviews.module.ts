import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { AnalysisModule } from '../analysis/analysis.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, AnalysisModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, JwtAuthGuard],
})
export class InterviewsModule {}
