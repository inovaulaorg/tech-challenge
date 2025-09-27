import React from 'react';
import styled from 'styled-components';
import { Container, Box, Text, Flex } from '../ui';
import { useTheme } from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-top: auto;
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.gray[400]};
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: underline;
  }
`;

export const Footer: React.FC = () => {
  const theme = useTheme();
  return (
    <FooterContainer>
      <Container>
        <Box style={{ padding: theme.space[8] }}>
          <Flex
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: theme.space[4],
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Text as="span" style={{ fontSize: theme.fontSizes.lg, fontWeight: theme.fontWeights.bold, color: theme.colors.white, marginBottom: theme.space[2], display: 'block' }}>
                TechBlog
              </Text>
              <Text as="span" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray[400] }}>
                A modern blog platform for developers
              </Text>
            </Box>
            <Flex style={{ gap: theme.space[6] }}>
              <FooterLink href="#about">About</FooterLink>
              <FooterLink href="#privacy">Privacy</FooterLink>
              <FooterLink href="#terms">Terms</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </Flex>
          </Flex>
          <Box
            style={{
              borderTop: `1px solid ${theme.colors.gray[700]}`,
              paddingTop: theme.space[4],
              marginTop: theme.space[8],
            }}
          >
            <Text as="span" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray[400], textAlign: 'center', display: 'block' }}>
              © {new Date().getFullYear()} TechBlog. All rights reserved.
            </Text>
          </Box>
        </Box>
      </Container>
    </FooterContainer>
  );
};