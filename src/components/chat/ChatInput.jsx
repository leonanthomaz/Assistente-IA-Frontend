// src/components/ChatInput.jsx
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaMicrophone, FaStop, FaPaperPlane } from 'react-icons/fa';

const Bar = styled.form`
  display: flex;
  gap: ${(p) => p.theme.spacing.sm};
  padding: ${(p) => p.theme.spacing.md};
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.surface};
  align-items: center;
`;

const TextInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: ${(p) => p.theme.borderRadius.pill};
  border: 1px solid ${(p) => p.theme.colors.border};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  font-size: 15px;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
  &::placeholder {
    color: #666;
  }
`;

const IconButton = styled.button`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
  background: ${(p) =>
    p.$variant === 'send' ? p.theme.colors.primary : p.theme.colors.surfaceHover};
  flex-shrink: 0;
  &:hover:not(:disabled) {
    background: ${(p) =>
      p.$variant === 'send' ? p.theme.colors.primaryHover : '#3a3a3a'};
    transform: scale(1.05);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 163, 127, 0.7); }
  70% { box-shadow: 0 0 0 16px rgba(16, 163, 127, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 163, 127, 0); }
`;

const RecordingButton = styled(IconButton)`
  background: ${(p) =>
    p.$recording ? p.theme.colors.primary : p.theme.colors.surfaceHover};
  animation: ${(p) => (p.$recording ? pulse : 'none')} 1.4s infinite;
`;

const ChatInput = ({ onSendText, onMicClick, recording, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSendText(text);
    setInput('');
  };

  return (
    <Bar onSubmit={handleSubmit}>
      <TextInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={disabled || recording}
      />

      <RecordingButton
        type="button"
        $recording={recording}
        onClick={onMicClick}
        disabled={disabled}
        title={recording ? 'Parar gravação' : 'Gravar áudio'}
      >
        {recording ? <FaStop /> : <FaMicrophone />}
      </RecordingButton>

      <IconButton
        type="submit"
        $variant="send"
        disabled={!input.trim() || disabled || recording}
        title="Enviar"
      >
        <FaPaperPlane />
      </IconButton>
    </Bar>
  );
};

export default ChatInput;