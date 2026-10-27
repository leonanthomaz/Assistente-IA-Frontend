import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.theme.colors.background};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${(p) => p.theme.colors.surfaceHover};
  border-top-color: ${(p) => p.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Loading = () => (
  <Container>
    <Spinner />
  </Container>
);

export default Loading;