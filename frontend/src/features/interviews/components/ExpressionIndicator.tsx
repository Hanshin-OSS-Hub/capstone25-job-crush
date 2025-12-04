import type { FaceAnalysisMetrics } from '../types/analysis.types';

type ExpressionIndicatorProps = {
  metrics: FaceAnalysisMetrics | null;
};

const ExpressionIndicator = ({ metrics }: ExpressionIndicatorProps) => {
  const expression = metrics?.expression;
  const headPose = metrics?.headPose;

  return (
    <div className="rounded-xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      <p className="text-xs font-semibold text-gray-500">표정 & 헤드포즈</p>
      <div className="mt-2 text-sm text-black dark:text-white">
        <p className="font-semibold capitalize">
          {expression ? `${expression.label}` : '분석 대기 중'}
        </p>
        <p className="text-xs text-gray-500">
          Confidence: {expression ? `${Math.round(expression.confidence * 100)}%` : '--'}
        </p>
      </div>
      {headPose && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-gray-500 dark:text-gray-400">
          <div>
            <p className="font-semibold text-black dark:text-white">{headPose.pitch}°</p>
            <p>Pitch</p>
          </div>
          <div>
            <p className="font-semibold text-black dark:text-white">{headPose.yaw}°</p>
            <p>Yaw</p>
          </div>
          <div>
            <p className="font-semibold text-black dark:text-white">{headPose.roll}°</p>
            <p>Roll</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpressionIndicator;

