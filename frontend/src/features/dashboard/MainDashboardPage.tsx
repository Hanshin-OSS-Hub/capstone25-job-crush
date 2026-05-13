// frontend/src/features/dashboard/MainDashboardPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { SiBookstack } from "react-icons/si";
import { FaTrophy, FaMicrophone, FaCalendar } from "react-icons/fa";
import AnalysisCard, {
  type AnalysisData,
} from "../../components/ui/AnalysisCard";
import { apiClient, getStoredAccessToken } from "@/api/client";
import { API_ENDPOINTS } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";

type AnalysisHistoryItem = {
  id: number;
  companyName: string;
  resumeTitle: string;
  totalScore: number;
  createdAt: string;
};

type AnalysisHistoryResponse = {
  analyses: AnalysisHistoryItem[];
  interviewCount: number;
};

const PALETTE: Pick<AnalysisData, "logoBgColor" | "logoTextColor">[] = [
  { logoBgColor: "bg-blue-50", logoTextColor: "text-blue-600" },
  { logoBgColor: "bg-red-50", logoTextColor: "text-red-500" },
  { logoBgColor: "bg-green-50", logoTextColor: "text-green-600" },
  { logoBgColor: "bg-cyan-50", logoTextColor: "text-cyan-600" },
  { logoBgColor: "bg-orange-50", logoTextColor: "text-orange-600" },
  { logoBgColor: "bg-purple-50", logoTextColor: "text-purple-600" },
];

function formatDashboardDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function mapHistoryToCards(rows: AnalysisHistoryItem[]): AnalysisData[] {
  return rows.map((row, i) => {
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
}

const MainDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([]);
  const [interviewCount, setInterviewCount] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const token = getStoredAccessToken();

    const load = async () => {
      if (!token) {
        setAnalyses([]);
        setInterviewCount(0);
        setHistoryLoading(false);
        return;
      }
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const { data } = await apiClient.get<AnalysisHistoryResponse>(
          API_ENDPOINTS.ANALYSIS.HISTORY,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!cancelled) {
          setAnalyses(data.analyses);
          setInterviewCount(data.interviewCount);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          if (isAxiosError(err)) {
            setHistoryError("분석 기록을 불러오지 못했습니다.");
          } else {
            setHistoryError("분석 기록을 불러오지 못했습니다.");
          }
          setAnalyses([]);
        }
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.name?.trim() || "회원";

  const stats = useMemo(() => {
    const total = analyses.length;
    const sum = analyses.reduce((acc, a) => acc + a.totalScore, 0);
    const avg = total > 0 ? Math.round(sum / total) : 0;
    const now = new Date();
    const ym = `${now.getFullYear()}-${now.getMonth()}`;
    const thisMonth = analyses.filter((a) => {
      const d = new Date(a.createdAt);
      return `${d.getFullYear()}-${d.getMonth()}` === ym;
    }).length;
    return { total, avg, thisMonth };
  }, [analyses]);

  const cardData = useMemo(
    () => mapHistoryToCards(analyses.slice(0, 6)),
    [analyses],
  );

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 2xl:p-10">
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 md:p-8 shadow-default">
        <p className="text-lg font-semibold text-primary mb-2">
          {displayName}님, 환영합니다
        </p>
        <h1 className="text-xl font-bold text-black dark:text-white mb-6">
          새로운 자소서 분석을 시작하세요
        </h1>
        <h4 className="text-s text-black dark:text-white mb-6">
          AI가 당신의 자소서를 분석하고 맞춤형 피드백을 제공합니다
        </h4>
        <button
          type="button"
          onClick={() => navigate("/analysis")}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-primary py-3 px-6 text-center font-medium text-primary hover:bg-primary hover:text-white transition-all"
        >
          <SiBookstack className="h-5 w-5" />새 분석 시작하기
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            총 분석 횟수
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">
              {stats.total}
            </p>
            <div className="h-9 w-9 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
              <SiBookstack className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            평균 점수
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">
              {stats.total > 0 ? stats.avg : "—"}
              {stats.total > 0 ? <span className="text-sm">점</span> : null}
            </p>
            <div className="h-9 w-9 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
              <FaTrophy />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            면접 연습
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">
              {interviewCount}
              <span className="text-sm">회</span>
            </p>
            <div className="h-9 w-9 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">
              <FaMicrophone />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-stroke bg-white dark:bg-boxdark py-6 px-7.5 shadow-default">
          <h4 className="text-title-md font-semibold text-black dark:text-white">
            이번 달 분석
          </h4>
          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-bold text-black dark:text-white">
              {stats.thisMonth}
            </p>
            <div className="h-9 w-9 rounded-md bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaCalendar />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            최근 분석 기록
          </h2>
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="text-sm font-medium text-primary hover:underline"
          >
            전체보기
          </button>
        </div>

        {historyError ? (
          <p className="text-sm text-meta-1">{historyError}</p>
        ) : null}
        {historyLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : cardData.length === 0 ? (
          <p className="text-sm text-body py-6">
            아직 분석 기록이 없습니다. 위에서 새 분석을 시작해 보세요.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cardData.map((data) => (
              <AnalysisCard key={data.id} data={data} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainDashboardPage;
