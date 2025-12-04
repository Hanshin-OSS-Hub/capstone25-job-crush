declare module 'pitchfinder' {
  interface DetectorConfig {
    sampleRate?: number;
  }

  type Detector = (buffer: Float32Array, sampleRate?: number) => number | null;

  export function YIN(config?: DetectorConfig): Detector;
}

