import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { FaRobot } from 'react-icons/fa';

import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.background};
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(229, 9, 20, 0.15),
      transparent 70%
    );
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const LoginCard = styled.div`
  background: rgba(20, 20, 20, 0.95);
  padding: 48px 40px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 1;
  border: 1px solid rgba(229, 9, 20, 0.2);

  @media (max-width: 480px) {
    padding: 32px 20px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: ${(p) => p.theme.colors.primary};
`;

const Title = styled.h1`
  text-align: center;
  font-size: 24px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${(p) => p.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 32px;
  font-size: 14px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  background: #0d0d0d;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
  }
  &::placeholder { color: #666; }
`;

const Button = styled.button`
  padding: 14px;
  background: ${(p) => p.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
  letter-spacing: 0.5px;

  &:hover:not(:disabled) {
    background: ${(p) => p.theme.colors.primaryHover};
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ErrorMessage = styled.div`
  color: ${(p) => p.theme.colors.error};
  font-size: 13px;
  text-align: center;
  margin-top: 8px;
`;

function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha todos os campos');
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
      navigate('/');
    } else {
      setError(result.error || 'Credenciais inválidas');
      enqueueSnackbar(result.error || 'Erro ao fazer login', { variant: 'error' });
    }
  };

  return (
    <Container>
      <LoginCard>
        <LogoContainer>
          <FaRobot size={56} />
        </LogoContainer>
        <Title>Jarvis</Title>
        <Subtitle>Sua assistente pessoal</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Usuário</Label>
            <Input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </InputGroup>

          <InputGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </LoginCard>
    </Container>
  );
}

export default LoginPage;