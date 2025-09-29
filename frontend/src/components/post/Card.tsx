import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text } from '../../components/ui';
import { Post } from '../../types';

const StyledPostCard = styled(Box)`
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    transform: translateY(-2px) scale(1.01);
    background: #f7fafc;
  }
`;

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  return (
    <StyledPostCard
      bg="gray.50"
      p={6}
      borderRadius="md"
      boxShadow="sm"
      mb={6}
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <Heading as="h2" mb={2} fontSize="1.5rem">{post.title}</Heading>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <strong>Autor:</strong>
        <span style={{ marginLeft: 6 }}>{post.author.username}</span>
        {post.author.avatar && (
          <img src={post.author.avatar} alt={post.author.username} style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8 }} />
        )}
      </div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} style={{ maxWidth: '300px', margin: '1rem 0', borderRadius: 8 }} />
      )}
      <Text mb={2}>{post.excerpt ?? ''}</Text>
      <div>
          <strong>Tags:</strong> {(post.tags ?? []).join(', ')}
      </div>
      <div>
        <strong>Publicado em:</strong> {new Date(post.publishedAt).toLocaleString()}
      </div>
    </StyledPostCard>
  );
};