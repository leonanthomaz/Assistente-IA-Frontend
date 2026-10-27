// src/components/ChatMessage.jsx
import styled from 'styled-components';

const Bubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${(p) => p.theme.borderRadius.lg};
  font-size: 15px;
  line-height: 1.5;
  align-self: ${(p) => (p.$role === 'user' ? 'flex-end' : 'flex-start')};
  background: ${(p) =>
    p.$role === 'user' ? p.theme.colors.primary : p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  box-shadow: ${(p) => p.theme.shadows.card};
  border-bottom-${(p) => (p.$role === 'user' ? 'right' : 'left')}-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ChatMessage = ({ role, content }) => (
  <Bubble $role={role}>{content}</Bubble>
);

export default ChatMessage;