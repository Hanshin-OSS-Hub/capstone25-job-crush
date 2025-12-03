import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DefaultLayout from "../components/layout/DefaultLayout";
import MainDashboardPage from "../features/dashboard/MainDashboardPage";
import ResumeAnalysisPage from "../features/analysis/ResumeAnalysisPage";
import AnalysisResultPage from "../features/analysis/AnalysisResultPage";
import AnalysisHistoryPage from "../features/history/AnalysisHistoryPage";
// ... 다른 import들

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
  {
    path: "/history", // 경로 추가
    element: (
      <DefaultLayout>
        <AnalysisHistoryPage />
      </DefaultLayout>
    ),
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
