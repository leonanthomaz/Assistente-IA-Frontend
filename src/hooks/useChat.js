// src/hooks/useChat.js
import { useCallback, useEffect, useRef, useState } from 'react';
import { chatService, voiceService } from '../api';
import { base64ToBlob } from '../utils/audio';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const chatIdRef = useRef(null);

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => [
      ...prev,
      { role, content, id: `${Date.now()}-${Math.random()}` },
    ]);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await chatService.getCurrentChat();
        if (cancelled) return;

        if (data?.chat?.id) {
          chatIdRef.current = data.chat.id;
        }

        if (Array.isArray(data?.messages)) {
          setMessages(
            data.messages.map((m, i) => ({
              role: m.role,
              content: m.content,
              id: `hist-${i}-${Date.now()}`,
            }))
          );
        }
      } catch (err) {
        console.error('Erro ao carregar chat atual:', err);
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sendText = useCallback(
    async (text) => {
      if (!text?.trim()) return { success: false };
      addMessage('user', text);
      setSending(true);
      try {
        const data = await chatService.sendText(text, {
          chatId: chatIdRef.current,
        });
        if (data.chat_id) chatIdRef.current = data.chat_id;
        addMessage('assistant', data?.response || 'Sem resposta');
        return { success: true, data };
      } catch (err) {
        console.error(err);
        addMessage('assistant', 'Desculpe, ocorreu um erro.');
        return { success: false, error: err };
      } finally {
        setSending(false);
      }
    },
    [addMessage]
  );

  const sendVoice = useCallback(
    async (wavBlob) => {
      setProcessingVoice(true);
      try {
        const data = await voiceService.sendVoice(wavBlob, {
          chatId: chatIdRef.current,
        });
        if (data.chat_id) chatIdRef.current = data.chat_id;
        if (data.user_text) addMessage('user', data.user_text);
        if (data.assistant_text) addMessage('assistant', data.assistant_text);

        if (data.audio) {
          const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
          const url = URL.createObjectURL(audioBlob);
          new Audio(url).play().catch(() => {});
        }
        return { success: true, data };
      } catch (err) {
        console.error(err);
        addMessage('assistant', 'Falha ao processar áudio.');
        return { success: false, error: err };
      } finally {
        setProcessingVoice(false);
      }
    },
    [addMessage]
  );

  return {
    messages,
    sending,
    processingVoice,
    loadingHistory,
    sendText,
    sendVoice,
  };
};

export default useChat;