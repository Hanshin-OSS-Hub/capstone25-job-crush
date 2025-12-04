import type { AudioAnalysisMetrics } from '../types/analysis.types';

type AudioFeedbackProps = {
  metrics: AudioAnalysisMetrics | null;
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col rounded-lg border border-stroke p-3 text-center dark:border-strokedark">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-lg font-bold text-black dark:text-white">{value}</span>
  </div>
);

const AudioFeedback = ({ metrics }: AudioFeedbackProps) => {
  return (
    <div className="rounded-xl border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark">
      <p className="text-xs font-semibold text-gray-500">음성 분석</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <StatItem label="Pitch" value={metrics ? `${metrics.pitchHz} Hz` : '--'} />
        <StatItem label="Energy" value={metrics ? metrics.energy.toString() : '--'} />
        <StatItem label="WPM" value={metrics ? `${metrics.speechRateWpm}` : '--'} />
        <StatItem label="Jitter" value={metrics ? `${metrics.jitter}` : '--'} />
      </div>
    </div>
  );
};

export default AudioFeedback;

