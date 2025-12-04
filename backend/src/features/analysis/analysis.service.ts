import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

// [핵심] require를 사용해서 강제로 불러옵니다.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

@Injectable()
export class AnalysisService {
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) throw new Error('Key Error');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      // require로 불러왔으므로 이제 함수로 실행됩니다.
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF Error:', error);
      throw new Error('PDF 파싱 실패');
    }
  }

  async analyzeWithGemini(
    resumeText: string,
    jobDescription: string,
    companyName: string,
  ) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = this.createAnalysisPrompt(resumeText, jobDescription);

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const responseText = result.response.text();

      // 마크다운 코드블록(```json ... ```)이 포함될 수 있으므로 먼저 제거
      const cleanedText = responseText.replace(/```json|```/g, '').trim();

      let aiResponse: any;
      try {
        aiResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Gemini JSON Parse Error:', parseError, cleanedText);
        throw new Error('AI 응답 파싱 실패');
      }

      return {
        companyName: companyName, // 프론트에서 받은 기업명 그대로 반환
        jobRole: '지원 직무', // (필요하면 AI에게 직무명을 추출해달라고 할 수도 있음)
        totalScore: aiResponse.totalScore || 0,
        summary: aiResponse.overallAssessment,
        items: [
          {
            id: 1,
            question: '자기소개서 분석 결과',
            answer: resumeText.substring(0, 300) + '...', // 원문 일부 표시
            score: aiResponse.totalScore || 0,
            feedbacks: [
              ...(aiResponse.strengths?.map((s) => ({
                type: 'good',
                title: '강점',
                content: s,
              })) || []),
              ...(aiResponse.weaknesses?.map((w) => ({
                type: 'bad',
                title: '보완점',
                content: w,
              })) || []),
              ...(aiResponse.proofreading?.map((p) => ({
                type: 'suggestion',
                title: '맞춤법/표현',
                content: `"${p.original}" -> "${p.corrected}"`,
              })) || []),
            ],
          },
        ],
      };
    } catch (error) {
      console.error('Gemini Error:', error);
      throw new Error('AI 분석 실패');
    }
  }
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
        "totalScore": 85,  <-- [중요] 점수 필드가 꼭 있어야 파싱됩니다.
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
    `;
  }
}
