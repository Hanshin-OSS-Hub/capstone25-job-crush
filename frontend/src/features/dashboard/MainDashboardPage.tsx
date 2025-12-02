// frontend/src/features/dashboard/MainDashboardPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { SiBookstack } from "react-icons/si";
import { FaTrophy, FaMicrophone, FaCalendar, FaBuilding } from "react-icons/fa";

// ----------------------------------------------------------------------
// 1. 데이터 타입 정의 (나중에 API 연동 시 중요)
// ----------------------------------------------------------------------
interface AnalysisData {
  id: number;
  company: string;
  role: string;
  // Tailwind 클래스를 데이터로 관리 (색상)
  logoBgColor: string;
  logoTextColor: string;
  status: "완료" | "진행중";
  fitScore: string;
  jobScore: string;
  date: string;
}

// ----------------------------------------------------------------------
// 2. 가짜 데이터 (Mock Data)
// 나중에 이 부분을 백엔드 API 응답으로 교체하면 됩니다.
// ----------------------------------------------------------------------
const mockAnalysisData: AnalysisData[] = [
  {
    id: 1,
    company: "네이버",
    role: "프론트엔드 개발자",
    logoBgColor: "bg-blue-50",
    logoTextColor: "text-blue-600",
    status: "완료",
    fitScore: "85점",
    jobScore: "78점",
    date: "2024.01.15",
  },
  {
    id: 2,
    company: "카카오",
    role: "백엔드 개발자",
    logoBgColor: "bg-red-50",
    logoTextColor: "text-red-500",
    status: "완료",
    fitScore: "72점",
    jobScore: "84점",
    date: "2024.01.12",
  },
  {
    id: 3,
    company: "삼성전자",
    role: "소프트웨어 엔지니어",
    logoBgColor: "bg-green-50",
    logoTextColor: "text-green-600",
    status: "진행중",
    fitScore: "분석중...",
    jobScore: "분석중...",
    date: "2024.01.18",
  },
];

// ----------------------------------------------------------------------
// 3. 재사용 가능한 카드 컴포넌트 (AnalysisCard)
// ----------------------------------------------------------------------
const AnalysisCard = ({ data }: { data: AnalysisData }) => {
  // 상태에 따라 뱃지 색상 다르게 적용
  const statusBadgeClass =
    data.status === "완료"
      ? "bg-success text-success"
      : "bg-warning text-warning";

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* 카드 헤더: 로고 + 회사명 + 상태뱃지 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-lg ${data.logoBgColor} ${data.logoTextColor} dark:bg-meta-4 dark:text-white`}
          >
            <FaBuilding className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black dark:text-white">
              {data.company}
            </h3>
            <p className="text-sm font-medium text-body">{data.role}</p>
          </div>
        </div>
        <span
          className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${statusBadgeClass}`}
        >
          {data.status}
        </span>
      </div>

      {/* 점수 정보 */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-body">인재상 부합도</span>
          <span className="text-sm font-bold text-black dark:text-white">
            {data.fitScore}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-body">직무 적합도</span>
          <span className="text-sm font-bold text-black dark:text-white">
            {data.jobScore}
          </span>
        </div>
      </div>

      {/* 하단 날짜 및 버튼 */}
      <div className="flex items-center justify-between border-t border-stroke pt-4 dark:border-strokedark">
        <span className="text-sm font-medium text-body">{data.date}</span>
        <button className="text-sm font-medium text-primary hover:underline">
          {data.status === "진행중" ? "진행상황" : "자세히 보기"}
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 4. 메인 페이지 컴포넌트
// ----------------------------------------------------------------------
const MainDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 2xl:p-10">
      {/* 1. 상단 '새로운 자소서 분석' 섹션 */}
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 md:p-8 shadow-default">
        <h1 className="text-xl font-bold text-black dark:text-white mb-6">
          새로운 자소서 분석을 시작하세요
        </h1>
        <h4 className="text-s text-black dark:text-white mb-6">
          AI가 당신의 자소서를 분석하고 맞춤형 피드백을 제공합니다
        </h4>
        <button
          onClick={() => navigate("/analysis")}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-primary hover:text-white transition-all"
        >
          + 새 분석 시작하기
        </button>
      </div>

      {/* 2. 통계 카드 섹션 (정적) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 총 분석 횟수 */}
        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            총 분석 횟수
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">13</p>
            <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
              <SiBookstack className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* 평균 점수 */}
        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            평균 점수
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">
              71<span className="text-sm">점</span>
            </p>
            <div className="h-9 w-9 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
              <FaTrophy />
            </div>
          </div>
        </div>

        {/* 면접 연습 */}
        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            면접 연습
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">
              3<span className="text-sm">회</span>
            </p>
            <div className="h-9 w-9 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaMicrophone />
            </div>
          </div>
        </div>

        {/* 이번 달 분석 */}
        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            이번 달 분석
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">5</p>
            <div className="h-9 w-9 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 최근 분석 기록 섹션 (동적 렌더링 적용!) */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            최근 분석 기록
          </h2>
          <button className="text-sm font-medium text-primary hover:underline">
            전체보기
          </button>
        </div>

        {/* map 함수를 이용해 데이터를 카드로 변환 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockAnalysisData.map((data) => (
            <AnalysisCard key={data.id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainDashboardPage;
