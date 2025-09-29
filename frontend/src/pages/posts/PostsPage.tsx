import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, Heading, Text, Button, Box } from '../../components/ui';
import { postService } from '../../services/postService';
import { Post, PostsResponse, PaginationMeta } from '../../types';
import { Link } from 'react-router-dom';

const PostsGrid = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
`;

const PostCard = styled(Box)`
  position: relative;
  width: 300px;
  height: 400px;
  background-color: white;
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 768px) {
    width: 350px;
    height: 420px;
  }

  @media (min-width: 1024px) {
    width: 400px;
    height: 450px;
  }
`;

const PostImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 180px; /* altura fixa da imagem */
  object-fit: cover;
`;

const PostCardContent = styled(Box)`
  position: absolute;
  top: 180px; /* abaixo da imagem */
  left: 0;
  width: 100%;
  bottom: 50px; /* reserva espaço para o botão */
  padding: ${({ theme }) => theme.space[4]};
  overflow: hidden;
`;

const PostTitle = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.space[2]};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PostExcerpt = styled(Text)`
  color: ${({ theme }) => theme.colors.gray[600]};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const Badge = styled(Text)`
  background-color: ${({ theme }) => theme.colors.gray[200]};
  color: ${({ theme }) => theme.colors.gray[800]};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[2]}`};
  border-radius: ${({ theme }) => theme.radii.xl};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const PostButtonWrapper = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  text-align: center;
`;

export const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const response: PostsResponse = await postService.getPosts({ page });
      setPosts(response.posts);
      setPagination(response.pagination);
      setCurrentPage(response.pagination.currentPage);
    } catch (error) {
      console.error('Error fetching posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleNext = () => {
    if (pagination?.hasNextPage) fetchPosts(currentPage + 1);
  };

  const handlePrev = () => {
    if (pagination?.hasPrevPage) fetchPosts(currentPage - 1);
  };

  return (
    <Container padding={6}>
      <Heading as="h1" mb={6} color="gray.900" textAlign="center">
        All Posts
      </Heading>

      {loading && <Text mb={4}>Loading posts...</Text>}

      <PostsGrid>
        {posts.map((post) => (
          <PostCard key={post.id}>
            {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
            <PostCardContent>
              <PostTitle as="h3">{post.title}</PostTitle>
              {post.excerpt && <PostExcerpt>{post.excerpt}</PostExcerpt>}
              {post.tags?.length ? (
                <Box mt={2} display="flex" gap={2} flexWrap="wrap">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </Box>
              ) : null}
            </PostCardContent>
            <PostButtonWrapper>
              <Button variant="outline" size="sm" as={Link} to={`/posts/${post.id}`}>
                Read More
              </Button>
            </PostButtonWrapper>
          </PostCard>
        ))}
      </PostsGrid>

      {pagination && (
        <Box
          mt={4}
          display="flex"
          flexDirection={{ _: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          gap={{ _: 2, sm: 4 }}
          px={{ _: 4, sm: 0 }}
          mx="auto"
        >
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>

          <Text fontSize="sm" flexShrink={0}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>

          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
};
