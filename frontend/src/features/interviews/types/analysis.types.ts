export interface GazeVector {
  x: number;
  y: number;
  z: number;
  confidence: number; // 0~1
}

export type FaceExpression =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'fear'
  | 'disgust'
  | 'confused';

export interface FaceExpressionScore {
  label: FaceExpression;
  confidence: number;
}

export interface HeadPose {
  pitch: number;
  yaw: number;
  roll: number;
}

export interface FaceAnalysisMetrics {
  sessionId: string;
  questionId?: string;
  timestamp: number; // epoch ms
  gaze: GazeVector;
  eyeContactScore: number; // 0~1
  expression: FaceExpressionScore;
  headPose: HeadPose;
}

export interface AudioAnalysisMetrics {
  sessionId: string;
  questionId?: string;
  timestamp: number;
  pitchHz: number;
  energy: number;
  speechRateWpm: number;
  jitter: number;
  pauses?: Array<{ start: number; end: number }>;
}

export interface RealtimeAnalysisPayload {
  sessionId: string;
  questionId?: string;
  timestamp: number;
  face?: FaceAnalysisMetrics;
  audio?: AudioAnalysisMetrics;
}

