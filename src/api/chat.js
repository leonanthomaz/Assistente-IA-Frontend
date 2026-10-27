// src/api/chat.js
import http from './http';

export const chatService = {
  async sendText(message, { chatId = null, model = null } = {}) {
    const payload = { message };
    if (chatId) payload.chat_id = chatId;
    if (model) payload.model = model;
    const { data } = await http.post('/api/chat/chat', payload);
    return data;
  },
  async getCurrentChat() {
    const { data } = await http.get('/api/chat/chats/current');
    return data;
  },
  async listChats() {
    const { data } = await http.get('/api/chat/chats');
    return data;
  },
  async getHistory(chatId) {
    const { data } = await http.get(`/api/chat/chats/${chatId}/history`);
    return data;
  },
  async listModels() {
    const { data } = await http.get('/api/chat/models');
    return data;
  },
};

export default chatService;