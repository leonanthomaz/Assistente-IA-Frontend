// src/pages/Home.jsx
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext';
import Chat from '../components/chat/Chat';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.colors.background};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing.md} ${(p) => p.theme.spacing.lg};
  border-bottom: 1px solid ${(p) => p.theme.colors.border};
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  span {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${(p) => p.theme.colors.border};
  color: ${(p) => p.theme.colors.textSecondary};
  padding: 8px 14px;
  border-radius: ${(p) => p.theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.2s;
  &:hover {
    color: ${(p) => p.theme.colors.text};
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

function Home() {
  const { user, logout } = useAuth();

  return (
    <Container>
      <Header>
        <Title>
          Olá, <span>{user?.full_name?.split(' ')[0] || 'usuário'}</span>
        </Title>
        <LogoutButton onClick={logout}>
          <FaSignOutAlt /> Sair
        </LogoutButton>
      </Header>

      <Chat />
    </Container>
  );
}

export default Home;