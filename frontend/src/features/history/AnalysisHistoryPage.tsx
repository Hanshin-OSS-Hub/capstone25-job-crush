import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AnalysisData } from "../../components/ui/AnalysisCard.tsx";
import AnalysisCard from "../../components/ui/AnalysisCard";
import { FaSearch } from "react-icons/fa";
import { analysisApi } from "../analysis/api/analysis.api";
import type { AnalysisListItem } from "../analysis/api/analysis.api";

const LOGO_PALETTE = [
  { bg: "bg-blue-50", text: "text-blue-600" },
  { bg: "bg-red-50", text: "text-red-500" },
  { bg: "bg-green-50", text: "text-green-600" },
  { bg: "bg-cyan-50", text: "text-cyan-600" },
  { bg: "bg-orange-50", text: "text-orange-600" },
];

/** 서버 분석 기록을 카드 표시용 데이터로 변환 */
export const toAnalysisCardData = (
  item: AnalysisListItem,
  index: number,
): AnalysisData => {
  const palette = LOGO_PALETTE[index % LOGO_PALETTE.length];
  const date = new Date(item.createdAt);
  const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  return {
    id: item.id,
    company: item.companyName,
    role: item.jobRole,
    logoBgColor: palette.bg,
    logoTextColor: palette.text,
    status: "완료",
    fitScore: `${item.totalScore}점`,
    jobScore: `${item.totalScore}점`,
    date: formattedDate,
  };
};

const AnalysisHistoryPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<AnalysisListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    analysisApi
      .list()
      .then((data) => {
        if (mounted) setItems(data);
      })
      .catch(() => {
        if (mounted) setError("분석 기록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const cardData = useMemo(
    () => items.map((item, index) => toAnalysisCardData(item, index)),
    [items],
  );

  const filteredData = cardData.filter(
    (item) =>
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()),
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

      {/* 2. 상태별 렌더링 */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-danger/40 bg-danger/5 p-10">
          <p className="text-sm text-danger">{error}</p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredData.map((data) => (
            <AnalysisCard
              key={data.id}
              data={data}
              onClick={() => navigate(`/analysis/result?id=${data.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 dark:border-strokedark dark:bg-meta-4">
          <p className="text-gray-500">
            {items.length === 0 ? "아직 분석한 자소서가 없습니다." : "검색 결과가 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistoryPage;
