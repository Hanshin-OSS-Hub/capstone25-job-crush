import React from "react";
import { Link } from "react-router-dom";
// 👇 1. 아이콘 import (FaBriefcase 추가)
import { FaHome, FaBriefcase } from "react-icons/fa";

const DropdownUser = () => (
  <div className="text-black dark:text-white font-medium cursor-pointer">
    User
  </div>
);

type HeaderProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Header = (props: HeaderProps) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        {/* --- [좌측 영역 시작] --- */}
        <div className="flex items-center gap-4">
          {/* 1. 모바일용 햄버거 버튼 & 로고 */}
          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            {/* 햄버거 버튼 (기존 애니메이션 유지) */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!w-full delay-300"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "delay-400 !w-full"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!w-full delay-500"
                    }`}
                  ></span>
                </span>
              </span>
            </button>

            {/* 👇 [수정됨] 모바일 전용 로고 (서류가방 아이콘) */}
            <Link className="block flex-shrink-0 lg:hidden" to="/">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                {/* JobCrush(취업) 의미를 담은 서류가방 아이콘 */}
                <FaBriefcase size={20} />
              </div>
            </Link>
          </div>

          {/* 2. 데스크톱용 홈 버튼 (로고 + 텍스트) */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-primary dark:bg-meta-4">
              <FaHome className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-black dark:text-white">
              JobCrush
            </h1>
          </Link>
        </div>
        {/* --- [좌측 영역 끝] --- */}

        {/* 우측 사용자 영역 */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* 알림 등 추가 아이콘이 들어갈 자리 */}
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
