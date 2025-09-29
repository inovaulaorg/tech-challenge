import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Flex, Text, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { LoginModal } from '../modals/LoginModal';

const HeaderContainer = styled.header`
  background-color: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: none;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleLogout = () => logout();
  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  return (
    <>
      <HeaderContainer>
        <Container>
          <Flex
            as="header"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            py={[3, 4]}
            px={[2, 4]}
          >
            <Logo as={Link} to="/">TechBlog</Logo>

            <Flex alignItems="center" gap={[2, 4]} mt={[2, 0]}>
              <Button variant="ghost" as={Link} to="/posts" size="sm">
                Posts
              </Button>

              {isAuthenticated ? (
                <>
                  <Button variant="ghost" as={Link} to="/create" size="sm">Write</Button>
                  <Button
                    variant="ghost"
                    as={Link}
                    to={`/profile/${user?.id}`}
                    size="sm"
                    gap={2}
                  >
                    <Avatar>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
                    <Text fontSize="sm">{user?.username}</Text>
                  </Button>
                  <Button variant="ghost" size="sm" as={Link} to="/" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={openLoginModal}>
                    Login
                  </Button>
                  <Button variant="primary" as={Link} to="/register" size="sm">
                    Sign Up
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </HeaderContainer>

      {/* Login Modal */}
      {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />}
    </>
  );
};
