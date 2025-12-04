import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "../components/layout/DefaultLayout";
import MainDashboardPage from "../features/dashboard/MainDashboardPage";
import ResumeAnalysisPage from "../features/analysis/ResumeAnalysisPage";
import AnalysisResultPage from "../features/analysis/AnalysisResultPage";
// --- sjy 브랜치 추가분 ---
import AnalysisHistoryPage from "../features/history/AnalysisHistoryPage";
// --- dev 브랜치 추가분 ---
import InterviewSetupPage from "../pages/interviews/InterviewSetupPage";
import InterviewSessionPage from "../pages/interviews/InterviewSessionPage";
import InterviewResultPage from "../pages/interviews/InterviewResultPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DefaultLayout>
        <MainDashboardPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/analysis",
    element: (
      <DefaultLayout>
        <ResumeAnalysisPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/analysis/result", // 결과 페이지 경로
    element: (
      <DefaultLayout>
        <AnalysisResultPage />
      </DefaultLayout>
    ),
  },
  // --- sjy 브랜치 기능: 분석 기록 ---
  {
    path: "/history",
    element: (
      <DefaultLayout>
        <AnalysisHistoryPage />
      </DefaultLayout>
    ),
  },
  // --- dev 브랜치 기능: 면접 연습 관련 ---
  {
    path: "/interviews/setup",
    element: (
      <DefaultLayout>
        <InterviewSetupPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/interviews/session/:sessionId",
    element: (
      <DefaultLayout>
        <InterviewSessionPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/interviews/result/:sessionId",
    element: (
      <DefaultLayout>
        <InterviewResultPage />
      </DefaultLayout>
    ),
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;