import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateInterviewFromAnalysisDto } from './dto/create-interview-from-analysis.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import type { MulterFile } from '../analysis/analysis.controller';

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

  /** 턴 처리: 답변 오디오 업로드 → STT → 다음 질문 반환 */
  @Post('sessions/:id/answer')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('audio', {
      limits: { fileSize: 25 * 1024 * 1024 }, // 답변 오디오 최대 25MB
      fileFilter: (_req, file, cb) => {
        cb(null, /^audio\//.test(file.mimetype));
      },
    }),
  )
  async submitAnswer(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: MulterFile,
    @Body() dto: SubmitAnswerDto,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('답변 오디오가 업로드되지 않았습니다.');
    }
    return this.interviewsService.submitAnswer(
      userId,
      id,
      dto.questionId,
      file.buffer,
      file.originalname || 'answer.webm',
    );
  }

  /** 세션 종료: 전체 영상 업로드 → 비동기 종합 분석 시작 */
  @Post('sessions/:id/complete')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      limits: { fileSize: 200 * 1024 * 1024 }, // 세션 영상 최대 200MB
      fileFilter: (_req, file, cb) => {
        cb(null, /^video\//.test(file.mimetype));
      },
    }),
  )
  async completeSession(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: MulterFile,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('면접 영상이 업로드되지 않았습니다.');
    }
    return this.interviewsService.completeSession(
      userId,
      id,
      file.buffer,
      file.originalname || 'session.webm',
    );
  }

  /** 결과 페이지 폴링: 종합 평가 조회 (분석 중이면 evaluation=null) */
  @Get('sessions/:id/evaluation')
  @UseGuards(JwtAuthGuard)
  async getEvaluation(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.interviewsService.getEvaluationForUser(userId, id);
  }
}
