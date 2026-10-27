// src/components/Chat.jsx
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaMicrophone } from 'react-icons/fa';

import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Area = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: ${(p) => p.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing.md};
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.textSecondary};
  gap: ${(p) => p.theme.spacing.md};
  text-align: center;
  svg {
    color: ${(p) => p.theme.colors.primary};
    opacity: 0.6;
  }
`;

const Chat = () => {
  const { messages, sending, processingVoice, sendText, sendVoice } = useChat();
  const { recording, startRecording, stopRecording } = useAudioRecorder();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processingVoice]);

  const handleMicClick = async () => {
    if (recording) {
      await stopRecording({ onFinish: sendVoice });
    } else {
      await startRecording();
    }
  };

  const isBusy = sending || processingVoice;

  return (
    <Wrapper>
      <Area>
        {messages.length === 0 ? (
          <EmptyState>
            <FaMicrophone size={48} />
            <p>Fale ou escreva para começar a conversar com a Jarvis.</p>
          </EmptyState>
        ) : (
          messages.map((m) => (
            <ChatMessage key={m.id} role={m.role} content={m.content} />
          ))
        )}

        {processingVoice && (
          <ChatMessage role="assistant" content="Processando áudio..." />
        )}

        <div ref={bottomRef} />
      </Area>

      <ChatInput
        onSendText={sendText}
        onMicClick={handleMicClick}
        recording={recording}
        disabled={isBusy}
      />
    </Wrapper>
  );
};

export default Chat;