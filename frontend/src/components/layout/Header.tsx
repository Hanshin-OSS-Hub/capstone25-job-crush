import React from "react";
import { Link } from "react-router-dom";

// --- 누락된 컴포넌트 임시 플레이스홀더 ---
// const DarkModeSwitcher = () => <div className="text-whiten">DM</div>;
// const DropdownNotification = () => <div className="text-whiten">Noti</div>;
// const DropdownMessage = () => <div className="text-whiten">Msg</div>;
const DropdownUser = () => <div className="text-black">User</div>;
// const LogoIcon = 'logo.svg'; // 로고 경로 임시 처리
// ------------------------------------

// props 타입 지정
type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Header = (props: HeaderProps) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              {/* (햄버거 버튼 아이콘 SVG...) */}
            </span>
          </button>
          {/* */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            {/* <img src={LogoIcon} alt="Logo" /> */}
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </Link>
        </div>

        <div className="hidden sm:block"> </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <DarkModeSwitcher />
            <DropdownNotification />
            <DropdownMessage /> */}
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
