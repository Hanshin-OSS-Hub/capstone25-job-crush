import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { ReactNode } from "react";
import DefaultLayout from "../components/layout/DefaultLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainDashboardPage from "../features/dashboard/MainDashboardPage";
import ResumeAnalysisPage from "../features/analysis/ResumeAnalysisPage";
import AnalysisResultPage from "../features/analysis/AnalysisResultPage";
import AnalysisHistoryPage from "../features/history/AnalysisHistoryPage";
import InterviewSetupPage from "../pages/interviews/InterviewSetupPage";
import InterviewSessionPage from "../pages/interviews/InterviewSessionPage";
import InterviewResultPage from "../pages/interviews/InterviewResultPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import SettingsPage from "../pages/SettingsPage";
import LandingPage from "../pages/LandingPage";
import { useAuth } from "../contexts/AuthContext";

function RootHome() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
          aria-label="로딩 중"
        />
      </div>
    );
  }
  if (!user) {
    return <LandingPage />;
  }
  return (
    <DefaultLayout>
      <MainDashboardPage />
    </DefaultLayout>
  );
}

function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DefaultLayout>{children}</DefaultLayout>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootHome />,
  },
  {
    path: "/analysis",
    element: (
      <ProtectedLayout>
        <ResumeAnalysisPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/analysis/result",
    element: (
      <ProtectedLayout>
        <AnalysisResultPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedLayout>
        <AnalysisHistoryPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/interviews/setup",
    element: (
      <ProtectedLayout>
        <InterviewSetupPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/interviews/session/:sessionId",
    element: (
      <ProtectedLayout>
        <InterviewSessionPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/interviews/result/:sessionId",
    element: (
      <ProtectedLayout>
        <InterviewResultPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedLayout>
        <SettingsPage />
      </ProtectedLayout>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
