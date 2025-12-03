import { useState } from "react";
import type { AnalysisData } from "../../components/ui/AnalysisCard.tsx";
import AnalysisCard from "../../components/ui/AnalysisCard";
import { FaSearch } from "react-icons/fa";

// 더미 데이터 (나중엔 API로 불러옵니다)
const mockHistoryData: AnalysisData[] = [
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
    role: "SW 엔지니어",
    logoBgColor: "bg-green-50",
    logoTextColor: "text-green-600",
    status: "진행중",
    fitScore: "분석중...",
    jobScore: "분석중...",
    date: "2024.01.18",
  },
  {
    id: 4,
    company: "우아한형제들",
    role: "프로덕트 매니저",
    logoBgColor: "bg-cyan-50",
    logoTextColor: "text-cyan-600",
    status: "완료",
    fitScore: "88점",
    jobScore: "90점",
    date: "2024.01.05",
  },
  {
    id: 5,
    company: "토스",
    role: "데이터 분석가",
    logoBgColor: "bg-blue-50",
    logoTextColor: "text-blue-600",
    status: "완료",
    fitScore: "92점",
    jobScore: "89점",
    date: "2023.12.28",
  },
  {
    id: 6,
    company: "당근마켓",
    role: "서버 개발자",
    logoBgColor: "bg-orange-50",
    logoTextColor: "text-orange-600",
    status: "완료",
    fitScore: "79점",
    jobScore: "82점",
    date: "2023.12.15",
  },
];

const AnalysisHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 필터링 로직
  const filteredData = mockHistoryData.filter(
    (item) =>
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 1. 헤더 및 검색바 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            분석 기록
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            지금까지 분석한 {filteredData.length}개의 자소서가 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="기업명, 직무 검색..."
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-10 pr-4 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 2. 카드 그리드 */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredData.map((data) => (
            <AnalysisCard key={data.id} data={data} />
          ))}
        </div>
      ) : (
        // 데이터가 없을 때
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 dark:border-strokedark dark:bg-meta-4">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistoryPage;
