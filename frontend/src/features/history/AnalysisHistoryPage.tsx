import React, { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import type { AnalysisData } from "../../components/ui/AnalysisCard.tsx";
import AnalysisCard from "../../components/ui/AnalysisCard";
import { FaSearch } from "react-icons/fa";
import { apiClient, getStoredAccessToken } from "@/api/client";
import { API_ENDPOINTS } from "@/constants/api";

// API 응답 타입 정의 (대시보드와 동일)
type AnalysisHistoryItem = {
  id: number;
  companyName: string;
  resumeTitle: string;
  totalScore: number;
  createdAt: string;
};

type AnalysisHistoryResponse = {
  analyses: AnalysisHistoryItem[];
};

// 카드 색상 팔레트
const PALETTE: Pick<AnalysisData, "logoBgColor" | "logoTextColor">[] = [
  { logoBgColor: "bg-blue-50", logoTextColor: "text-blue-600" },
  { logoBgColor: "bg-red-50", logoTextColor: "text-red-500" },
  { logoBgColor: "bg-green-50", logoTextColor: "text-green-600" },
  { logoBgColor: "bg-cyan-50", logoTextColor: "text-cyan-600" },
  { logoBgColor: "bg-orange-50", logoTextColor: "text-orange-600" },
  { logoBgColor: "bg-purple-50", logoTextColor: "text-purple-600" },
];

// 날짜 포맷팅 함수
function formatDashboardDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

const AnalysisHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawAnalyses, setRawAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. DB에서 사용자별 분석 기록 불러오기
  useEffect(() => {
    let cancelled = false;
    const token = getStoredAccessToken();

    const fetchHistory = async () => {
      if (!token) {
        setRawAnalyses([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await apiClient.get<AnalysisHistoryResponse>(
          API_ENDPOINTS.ANALYSIS.HISTORY,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!cancelled) {
          // 백엔드 응답 형식에 맞춰 데이터 세팅
          setRawAnalyses(data.analyses || []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (isAxiosError(err)) {
            setError("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
          } else {
            setError("데이터를 불러오는데 오류가 발생했습니다.");
          }
          setRawAnalyses([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void fetchHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. API 데이터를 AnalysisCard용 UI 데이터로 변환
  const mappedData: AnalysisData[] = useMemo(() => {
    return rawAnalyses.map((row, i) => {
      const pal = PALETTE[i % PALETTE.length]!;
      const scoreLabel = `${row.totalScore}점`;
      return {
        id: row.id,
        company: row.companyName,
        role: row.resumeTitle,
        logoBgColor: pal.logoBgColor,
        logoTextColor: pal.logoTextColor,
        status: "완료",
        fitScore: scoreLabel,
        jobScore: scoreLabel,
        date: formatDashboardDate(row.createdAt),
      };
    });
  }, [rawAnalyses]);

  // 3. 검색어에 따른 필터링 적용
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return mappedData;
    const lowerTerm = searchTerm.toLowerCase();
    return mappedData.filter(
      (item) =>
        item.company.toLowerCase().includes(lowerTerm) ||
        item.role.toLowerCase().includes(lowerTerm),
    );
  }, [mappedData, searchTerm]);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 2xl:p-10">
      {/* 1. 헤더 및 검색바 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            분석 기록
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading
              ? "데이터를 불러오는 중입니다..."
              : `지금까지 분석한 ${mappedData.length}개의 자소서가 있습니다.`}
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
              disabled={isLoading || mappedData.length === 0}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 에러 발생 시 */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 border border-red-200">
          {error}
        </div>
      )}

      {/* 2. 카드 그리드 및 로딩 상태 처리 */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-stroke bg-white py-10 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500">
            분석 기록을 불러오고 있습니다...
          </p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredData.map((data) => (
            <AnalysisCard key={data.id} data={data} />
          ))}
        </div>
      ) : (
        // 검색 결과가 없거나 데이터가 없을 때
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 dark:border-strokedark dark:bg-meta-4">
          <p className="text-gray-500">
            {searchTerm
              ? "검색 결과가 없습니다."
              : "아직 분석된 기록이 없습니다."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistoryPage;
