// src/utils/audio.js

/** Converte base64 → Blob */
export const base64ToBlob = (base64, mimeType = 'audio/mpeg') => {
  const clean = base64.includes(',') ? base64.split(',')[1] : base64;
  const byteCharacters = atob(clean);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: mimeType });
};

/** Converte buffers PCM Float32 → Blob WAV */
export const encodeWAV = (buffers, sampleRate) => {
  const length = buffers.reduce((acc, b) => acc + b.length, 0);
  const merged = new Float32Array(length);
  let offset = 0;
  for (const b of buffers) {
    merged.set(b, offset);
    offset += b.length;
  }

  const pcmBuffer = new DataView(new ArrayBuffer(merged.length * 2));
  let idx = 0;
  for (let i = 0; i < merged.length; i++, idx += 2) {
    const s = Math.max(-1, Math.min(1, merged[i]));
    pcmBuffer.setInt16(idx, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  const header = new DataView(new ArrayBuffer(44));
  const blockAlign = 2;
  const byteRate = sampleRate * blockAlign;

  writeString(header, 0, 'RIFF');
  header.setUint32(4, 36 + pcmBuffer.byteLength, true);
  writeString(header, 8, 'WAVE');
  writeString(header, 12, 'fmt ');
  header.setUint32(16, 16, true);
  header.setUint16(20, 1, true);
  header.setUint16(22, 1, true);
  header.setUint32(24, sampleRate, true);
  header.setUint32(28, byteRate, true);
  header.setUint16(32, blockAlign, true);
  header.setUint16(34, 16, true);
  writeString(header, 36, 'data');
  header.setUint32(40, pcmBuffer.byteLength, true);

  return new Blob([header, pcmBuffer], { type: 'audio/wav' });
};

const writeString = (view, offset, str) => {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
};