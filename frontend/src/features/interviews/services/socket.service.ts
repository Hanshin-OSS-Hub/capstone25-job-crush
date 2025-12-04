import { io, type Socket } from 'socket.io-client';

import type {
  AudioStreamChunk,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../types/socket.types';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3000';

class InterviewSocketClient {
  private socket?: Socket<ServerToClientEvents, ClientToServerEvents>;

  connect(authToken?: string) {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      path: '/ws/interviews',
      transports: ['websocket'],
      auth: authToken ? { token: authToken } : undefined,
      autoConnect: true,
    });

    return this.socket;
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = undefined;
  }

  joinSession(sessionId: string) {
    this.socket?.emit('interview:join', { sessionId });
  }

  leaveSession(sessionId: string) {
    this.socket?.emit('interview:leave', { sessionId });
  }

  sendAudioChunk(payload: AudioStreamChunk) {
    this.socket?.emit('interview:audio', payload);
  }

  sendRealtimeAnalysis(payload: Parameters<ClientToServerEvents['interview:analysis']>[0]) {
    this.socket?.emit('interview:analysis', payload);
  }

  markAnswerComplete(payload: Parameters<ClientToServerEvents['interview:answer_complete']>[0]) {
    this.socket?.emit('interview:answer_complete', payload);
  }

  endSession(payload: Parameters<ClientToServerEvents['interview:end']>[0]) {
    this.socket?.emit('interview:end', payload);
  }

  on<E extends keyof ServerToClientEvents>(event: E, listener: ServerToClientEvents[E]) {
    this.socket?.on(event, listener);
    return () => this.socket?.off(event, listener);
  }
}

export const interviewSocketClient = new InterviewSocketClient();

