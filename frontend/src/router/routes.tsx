import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DefaultLayout from '../components/layout/DefaultLayout'; // 👈 새로 만든 레이아웃
import MainDashboardPage from '../features/dashboard/MainDashboardPage';
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
  // {
  //   path: '/login',
  //   element: <LoginPage />, // DefaultLayout이 알아서 Sidebar/Header를 숨겨줄 겁니다.
  // }
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;