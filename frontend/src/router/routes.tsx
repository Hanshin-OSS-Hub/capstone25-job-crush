import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DefaultLayout from '../components/layout/DefaultLayout';
import MainDashboardPage from '../features/dashboard/MainDashboardPage';
import ResumeAnalysisPage from '../features/analysis/ResumeAnalysisPage'; // 👈 import 추가
// ... 다른 import들

const router = createBrowserRouter([
  {
    path: '/',
    // 뼈대를 DefaultLayout으로 교체합니다.
    element: (
      <DefaultLayout>
        <MainDashboardPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/analysis',
    element: (
      <DefaultLayout>
        <ResumeAnalysisPage />
      </DefaultLayout>
    ),
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;