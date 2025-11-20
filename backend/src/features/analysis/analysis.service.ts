<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

// pdf-parse는 CJS라 require로 불러오는 게 편함
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

@Injectable()
export class AnalysisService {
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('Key Error: GOOGLE_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * PDF 버퍼에서 텍스트 추출
   */
  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      // 필요하면 여기서 전처리 가능 (공백 정리 등)
      return data.text ?? '';
    } catch (error) {
      console.error('📄 PDF Error:', error);
      throw new Error('PDF 파싱 실패');
    }
  }

  /**
   * 자소서 + 채용공고 텍스트를 Gemini로 분석
   */
  async analyzeWithGemini(resumeText: string, jobDescription: string) {
    // 🔥 길이 제한 (너무 긴 텍스트로 인한 fetch 실패 방지)
    const MAX_RESUME_LEN = 8000;
    const MAX_JD_LEN = 4000;

    const safeResume = resumeText.slice(0, MAX_RESUME_LEN);
    const safeJD = jobDescription.slice(0, MAX_JD_LEN);

    console.log(
      '📌 resume length:',
      resumeText.length,
      '→ truncated:',
      safeResume.length,
    );
    console.log(
      '📌 jd length:',
      jobDescription.length,
      '→ truncated:',
      safeJD.length,
    );

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const prompt = this.createAnalysisPrompt(safeResume, safeJD);

    const generationConfig: GenerationConfig = {
      responseMimeType: 'application/json',
      temperature: 0.2,
    };

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const responseText = result.response.text();

      // 혹시 모델이 ```json ``` 안에 넣어서 줄 때를 대비해 제거
      const cleanedText = responseText.replace(/```json|```/g, '').trim();

      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('🤖 Gemini Error:', error);
      throw new Error('AI 분석 실패');
    }
  }

  /**
   * 프롬프트 생성
   */
  private createAnalysisPrompt(resume: string, jd: string): string {
    return `
당신은 수석 채용 담당자이자 전문 커리어 코치입니다.
제시된 [채용 공고]를 기준으로 [자소서 원문]을 분석하고,
제안서 요구사항인 [맞춤법 교정], [문맥 흐름], [직무 키워드 적합성], [강점 및 약점], [예상 면접 질문]을
반드시 JSON 형식으로 반환해야 합니다.

[채용 공고]
${jd}

[자소서 원문]
${resume}

[요구사항 및 JSON 출력 형식]
{
  "overallAssessment": "자소서에 대한 전반적인 총평 (예: '직무 이해도는 높으나, 구체적인 성과가 부족합니다.')",
  "proofreading": [
    {
      "original": "잘못된 원문 부분",
      "corrected": "수정 제안",
      "advice": "수정 이유 (예: '맞춤법 오류')"
    }
  ],
  "keywordAnalysis": {
    "requiredKeywords": ["채용 공고의 핵심 키워드 1", "키워드 2"],
    "matchedKeywords": ["자소서에서 발견된 일치 키워드 1"],
    "missingKeywords": ["자소서에 누락되었지만 중요한 키워드 1"],
    "advice": "키워드 적합성 및 보완점에 대한 조언"
  },
  "strengths": [
    "자소서에 드러난 강점 1 (직무 연관성)",
    "강점 2"
  ],
  "weaknesses": [
    "자소서에 드러난 약점 또는 보완점 1",
    "약점 2"
  ],
  "interviewQuestions": [
    {
      "question": "자소서 내용 기반의 예상 면접 질문 1 (예: '00 프로젝트 경험에 대해 더 자세히 설명해주세요.')",
      "intention": "이 질문의 의도 (예: '문제 해결 능력을 확인하기 위함')"
    },
    {
      "question": "자소서와 채용 공고를 연결한 압박 질문 1",
      "intention": "직무 적합성을 재확인하기 위함"
    }
  ]
}
반드시 위 JSON 구조를 그대로 따르고, 추가 텍스트나 설명 없이 JSON만 반환하세요.
`;
  }
}
=======
// 분석 서비스
// 데이터 분석 비즈니스 로직을 처리합니다

import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisService {
  // TODO: 분석 로직 구현
  // async analyzeSalaryTrends() {
  //   // 분석 로직
  // }
}

>>>>>>> dev
