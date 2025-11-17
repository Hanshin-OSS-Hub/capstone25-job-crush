import React, { useState } from 'react';
import Header from './Header'; // 6단계에서 만들 파일
import Sidebar from './Sidebar'; // 7단계에서 만들 파일

// DefaultLayout.jsx 코드를 .tsx로 변환 (타입 추가)
const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 참고: 로그인/회원가입 페이지에서 레이아웃을 숨기는 코드는
  // react-router-dom v6 방식에 맞게 나중에 수정이 필요할 수 있습니다.
  // 지금은 일단 그대로 둡니다.
  
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* */}

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* */}

          {/* */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* */}
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;