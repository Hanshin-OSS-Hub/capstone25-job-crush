// frontend/src/features/analysis/ResumeAnalysisPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnalysisSection from './components/AnalysisSection'; 
import { FaCloudUploadAlt, FaMagic, FaArrowLeft, FaSpinner } from "react-icons/fa"; 

const ResumeAnalysisPage = () => {
  const navigate = useNavigate();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 1. 입력 데이터 상태 관리
  const [formData, setFormData] = useState({
    companyName: '',
    jobDescription: '',
    resumeContent: '',
    resumeFile: null as File | null,
  });

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resumeFile: e.target.files![0] }));
    }
  };

  // ✅ [수정됨] 분석 요청 및 데이터 전달 핸들러
  const handleAnalyzeClick = () => {
    // 유효성 검사 예시 (필요시 주석 해제)
    // if (!formData.companyName || !formData.resumeContent) {
    //   alert('기업명과 자소서 내용을 입력해주세요.');
    //   return;
    // }

    setIsAnalyzing(true); // 로딩 화면 띄우기

    // 3초 후에 분석 완료 처리 (나중에 실제 API 호출로 대체)
    setTimeout(() => {
      setIsAnalyzing(false); // 로딩 화면 끄기
      
      // 👇 [핵심] 결과 페이지로 이동하면서 formData를 state로 넘겨줍니다.
      navigate('/analysis/result', { 
        state: { 
          companyName: formData.companyName,
          jobDescription: formData.jobDescription,
          resumeContent: formData.resumeContent 
        } 
      });
      
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-3xl pb-10 relative">

      {/* 로딩 모달 */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-boxdark border border-gray-100 dark:border-strokedark">
            
            {/* 아이콘 애니메이션 */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FaMagic className="h-10 w-10 animate-pulse text-primary" />
            </div>
            
            {/* 텍스트 */}
            <h3 className="mb-2 text-xl font-bold text-black dark:text-white">
              AI가 자소서를 분석하고 있어요
            </h3>
            <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
              기업의 인재상과 직무 적합도를 꼼꼼히 확인 중입니다...
            </p>

            {/* 로딩 바 (Progress Bar) */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="absolute left-0 top-0 h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-primary"></div>
            </div>
            
            <p className="mt-3 text-xs text-gray-400">
              잠시만 기다려주세요 (약 30초 소요)
            </p>
          </div>
        </div>
      )}
      
      {/* 1. 페이지 헤더 */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-black dark:text-white">
          AI 분석 시작하기
        </h1>
        <p className="text-body text-gray-500 dark:text-gray-400">
          기업 정보와 자기소개서를 입력하시면 AI가 맞춤형 분석을 제공합니다
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* STEP 1: 지원할 기업 */}
        <AnalysisSection step={1} title="지원할 기업">
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="기업명을 입력하세요 (예: 네이버)"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          />
        </AnalysisSection>

        {/* STEP 2: 지원할 직무 (공고) */}
        <AnalysisSection step={2} title="지원할 직무 (공고)">
          <textarea
            rows={6}
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="채용 공고 URL을 붙여넣거나, 공고 내용을 복사해 주세요"
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          ></textarea>
        </AnalysisSection>

        {/* STEP 3: 내 자기소개서 */}
        <AnalysisSection step={3} title="내 자기소개서">
          <textarea
            rows={8}
            name="resumeContent"
            value={formData.resumeContent}
            onChange={handleChange}
            placeholder="자기소개서 내용을 붙여넣어 주세요"
            className="mb-6 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
          ></textarea>

          <div className="mb-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
            <span className="text-sm text-gray-500 dark:text-gray-400">또는</span>
            <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
          </div>

          <div className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100 dark:border-gray-600 dark:bg-meta-4 dark:hover:bg-opacity-50">
            <input 
              type="file" 
              onChange={handleFileChange}
              className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0" 
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-boxdark">
                <FaCloudUploadAlt className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-primary">파일 업로드</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                또는 파일을 여기로 드래그하세요
              </p>
              <p className="text-xs text-gray-400">
                지원 형식: PDF, DOC, DOCX (최대 10MB)
              </p>
            </div>
          </div>
        </AnalysisSection>

        {/* 하단 버튼 액션 */}
        <div className="mt-4 flex flex-col items-center gap-4">
          <button 
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-medium text-white shadow-lg transition hover:bg-opacity-90 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <FaSpinner className="h-4 w-4 animate-spin" />
                분석중...
              </>
            ) : (
              <>
                <FaMagic className="h-4 w-4" />
                AI 분석 요청하기
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            분석에는 약 2-3분 정도 소요됩니다
          </p>
        </div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="fixed bottom-10 right-10 z-50 flex items-center gap-2 rounded-full bg-white border border-stroke px-6 py-3 text-black shadow-xl transition-all hover:bg-gray-100 hover:-translate-y-1 dark:bg-boxdark dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span className="font-medium">뒤로가기</span>
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalysisPage;