import type { FaceAnalysisMetrics } from '../types/analysis.types';

type GazeIndicatorProps = {
  metrics: FaceAnalysisMetrics | null;
};

const GazeIndicator = ({ metrics }: GazeIndicatorProps) => {
  const eyeContact = Math.round((metrics?.eyeContactScore ?? 0) * 100);

  return (
    <div className="rounded-xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      <p className="text-xs font-semibold text-gray-500">시선 집중도</p>
      <div className="mt-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.min(100, Math.max(0, eyeContact))}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Eye contact</span>
        <span className="font-semibold text-black dark:text-white">{eyeContact}%</span>
      </div>
    </div>
  );
};

export default GazeIndicator;

