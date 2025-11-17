import React from 'react';

// 점선 플레이스홀더 박스
const PlaceholderBox = ({ className = '' }: { className?: string }) => (
  <div
    className={`flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 ${className}`}
  >
    <span className="text-2xl text-gray-400">+</span>
  </div>
);

const MainDashboardPage = () => {
  return (
    <div className="flex flex-col space-y-6">
      <PlaceholderBox className="h-36" />
      <div className="grid grid-cols-4 gap-6">
        <PlaceholderBox className="h-28" />
        <PlaceholderBox className="h-28" />
        <PlaceholderBox className="h-28" />
        <PlaceholderBox className="h-28" />
      </div>
      <PlaceholderBox className="h-64" />
    </div>
  );
};

export default MainDashboardPage;