import { useEffect, useRef, useState } from 'react';

type AudioIndicatorProps = {
  stream: MediaStream | null;
};

const AudioIndicator = ({ stream }: AudioIndicatorProps) => {
  const [level, setLevel] = useState(0);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!stream) {
      setLevel(0);
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i += 1) {
        const value = dataArray[i] - 128;
        sum += value * value;
      }
      const rms = Math.sqrt(sum / dataArray.length) / 128;
      setLevel(Math.min(1, rms * 2));
      animationRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      source.disconnect();
      analyser.disconnect();
      audioContext.close();
    };
  }, [stream]);

  return (
    <div className="rounded-xl border border-stroke p-4 dark:border-strokedark">
      <p className="text-xs font-semibold text-gray-500">마이크 레벨</p>
      <div className="mt-3 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${Math.round(level * 100)}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {stream ? '마이크 입력이 감지되었습니다.' : '마이크 연결 대기 중'}
      </p>
    </div>
  );
};

export default AudioIndicator;

