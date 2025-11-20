import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AnalyzeResumeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(100)
  resumeText: string; // 자소서 원문

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  jobDescription: string; // 채용 공고 (JD) 내용
}