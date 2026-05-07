import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateInterviewFromAnalysisDto } from './dto/create-interview-from-analysis.dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async getSession(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.interviewsService.getSessionByIdForUser(userId, id);
  }

  @Post('from-analysis')
  @UseGuards(JwtAuthGuard)
  async createFromAnalysis(
    @CurrentUser('sub') userId: number,
    @Body() dto: CreateInterviewFromAnalysisDto,
  ) {
    return this.interviewsService.createFromAnalysis(
      userId,
      dto.analysisResultId,
    );
  }
}
