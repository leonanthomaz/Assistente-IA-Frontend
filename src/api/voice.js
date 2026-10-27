// src/api/voice.js
import http from './http';

export const voiceService = {
  async sendVoice(wavBlob, { chatId = null, model = null } = {}) {
    const formData = new FormData();
    formData.append('file', wavBlob, 'audio.wav');
    formData.append('return_audio', 'true');
    if (model) formData.append('model', model);
    if (chatId) formData.append('chat_id', chatId);

    const response = await http.post('/api/chat/chat/voice', formData);
    return response.data;
  },
};

export default voiceService;