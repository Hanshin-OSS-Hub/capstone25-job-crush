import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto';
import { Buffer } from 'buffer';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Controller('analysis')
@UseGuards(ThrottlerGuard)
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('resume')
  async analyzeResume(@Body() dto: AnalyzeResumeDto) {
    return this.analysisService.analyzeWithGemini(
      dto.resumeText,
      dto.jobDescription,
      dto.companyName,
    );
  }

  @Post('resume/upload')
  @UseInterceptors(FileInterceptor('resumeFile'))
  async analyzeResumePdf(
    @UploadedFile() file: MulterFile,
    @Body()
    body: {
      companyName: string;
      jobDescription: string;
      resumeContent: string;
    },
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }
    const text = await this.analysisService.extractTextFromPdf(file.buffer);
    return this.analysisService.analyzeWithGemini(
      text,
      body.jobDescription,
      body.companyName,
    );
  }
}
