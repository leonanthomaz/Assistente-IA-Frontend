// src/hooks/useAudioRecorder.js
import { useCallback, useRef, useState } from 'react';
import workletUrl from '../workers/audio-processor.js?url';
import { encodeWAV } from '../utils/audio';

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState(false);

  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const workletRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const buffersRef = useRef([]);
  const sampleRateRef = useRef(44100);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      sampleRateRef.current = audioCtx.sampleRate;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      await audioCtx.audioWorklet.addModule(workletUrl);

      const workletNode = new AudioWorkletNode(audioCtx, 'recorder-processor');
      workletNode.port.onmessage = (e) => {
        buffersRef.current.push(new Float32Array(e.data));
      };
      workletRef.current = workletNode;

      source.connect(workletNode);
      workletNode.connect(audioCtx.destination);

      buffersRef.current = [];
      setRecording(true);
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
    }
  }, []);

  /**
   * Para a gravação e retorna o Blob WAV (via callback).
   * O callback é opcional — se não for passado, o blob é descartado.
   */
  const stopRecording = useCallback(async ({ onFinish } = {}) => {
    setRecording(false);

    workletRef.current?.disconnect();
    sourceRef.current?.disconnect();
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    await audioCtxRef.current?.close();

    const wavBlob = encodeWAV(buffersRef.current, sampleRateRef.current);

    if (onFinish) {
      try {
        await onFinish(wavBlob);
      } catch (err) {
        console.error('Erro no callback do áudio:', err);
      }
    }

    return wavBlob;
  }, []);

  return {
    recording,
    startRecording,
    stopRecording,
  };
};

export default useAudioRecorder;