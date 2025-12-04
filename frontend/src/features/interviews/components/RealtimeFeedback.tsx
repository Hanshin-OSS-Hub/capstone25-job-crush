import AudioFeedback from './AudioFeedback';
import ExpressionIndicator from './ExpressionIndicator';
import GazeIndicator from './GazeIndicator';
import type { AudioAnalysisMetrics, FaceAnalysisMetrics } from '../types/analysis.types';

type RealtimeFeedbackProps = {
  faceMetrics: FaceAnalysisMetrics | null;
  audioMetrics: AudioAnalysisMetrics | null;
};

const RealtimeFeedback = ({ faceMetrics, audioMetrics }: RealtimeFeedbackProps) => {
  return (
    <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Realtime insight</p>
        <h3 className="text-lg font-semibold text-black dark:text-white">실시간 피드백</h3>
      </div>
      <div className="grid gap-3">
        <GazeIndicator metrics={faceMetrics} />
        <ExpressionIndicator metrics={faceMetrics} />
        <AudioFeedback metrics={audioMetrics} />
      </div>
    </div>
  );
};

export default RealtimeFeedback;

