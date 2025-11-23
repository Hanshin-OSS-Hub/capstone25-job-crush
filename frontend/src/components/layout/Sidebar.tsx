import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GoHomeFill, GoGraph } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";


// --- 누락된 컴포넌트 임시 플레이스홀더 ---
const SidebarLinkGroup = ({ children, activeCondition }: any) => {
  // 임시로 자식 컴포넌트(React.Fragment)만 렌더링
  return <>{children(() => {}, false)}</>; 
};
// ------------------------------------

// props 타입 지정
type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null); // 타입 지정
  const sidebar = useRef<HTMLElement>(null); // 타입 지정

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // useEffect 훅 2개 (click & keydown 핸들러) ...
  // (생략... 원본 코드에서 복사)

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* */}
      <div className="flex items-center justify-between gap-2 px-8 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <div className='text-2xl text-white font-bold'>JobCrush</div>
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          {/* (SVG 아이콘...) */}
        </button>
      </div>
      {/* */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* */}
        <nav className="mt-5 py-4 px-4 lg:px-6">
          {/* */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* */}
              <li>
                <NavLink
                  to="/" // 경로를 '/' (메인)으로 수정
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === '/' || pathname.includes('dashboard')) && // '/' 경로도 활성화
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <GoHomeFill />
                  대시보드
                </NavLink>
              </li>
              {/* */}
              <li>
                <NavLink
                  to="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <GoGraph />
                  분석기록
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FaMicrophone />
                  면접연습
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/calendar"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('calendar') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <FaGear />
                  설정
                </NavLink>
              </li>
              {/* (다른 메뉴 아이템들... SidebarLinkGroup 포함) */}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;