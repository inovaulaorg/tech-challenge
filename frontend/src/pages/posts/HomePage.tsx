import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Box, Heading, Text, Button, Flex } from '../../components/ui';
import { usePostsAdvanced } from '../../hooks/usePostsAdvanced';
import { useAuth } from '../../hooks/useAuth';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    posts,
    isLoading,
    error,
    likePost,
    deletePost,
    isLiking,
    isDeleting,
    canDeletePost,
  } = usePostsAdvanced();

  const handleLike = async (postId: number) => {
    try {
      await likePost(postId);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Unable to like post.';
      toast.error(message);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await deletePost(postId);
      if (response) {
        toast.success('Post deleted successfully.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Unable to delete post.';
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <Container py={8}>
        <Text>Loading posts...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py={8}>
        <Text color="red.500">Unable to load posts. Please try again later.</Text>
      </Container>
    );
  }

  return (
    <Container py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1">Latest Posts</Heading>
        {isAuthenticated && (
          <Button as={Link} to="/create" variant="primary">
            Create Post
          </Button>
        )}
      </Flex>

      {posts.length === 0 ? (
        <Box>
          <Text>No posts found.</Text>
        </Box>
      ) : (
        <Box display="grid" gridTemplateColumns={['1fr', null, 'repeat(2, 1fr)']} gap={6}>
          {posts.map((post) => {
            const rawSummary = post.excerpt || post.content || '';
            const preview = rawSummary.slice(0, 140);
            const showEllipsis = rawSummary.length > 140;

            return (
              <Box
                key={post.id}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={5}
                bg="white"
                boxShadow="sm"
              >
                <Heading as="h2" fontSize="xl" mb={2}>
                  {post.title}
                </Heading>
                <Text color="gray.500" mb={3}>
                  {preview}
                  {showEllipsis ? '…' : ''}
                </Text>

                {post.tags && post.tags.length > 0 && (
                  <Flex flexWrap="wrap" gap={2} mb={4}>
                    {post.tags.map((tag) => (
                      <Box
                        key={tag}
                        as="span"
                        px={2}
                        py={1}
                        borderRadius="full"
                        bg="gray.100"
                        color="gray.600"
                        fontSize="sm"
                      >
                        #{tag}
                      </Box>
                    ))}
                  </Flex>
                )}

                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center" gap={3}>
                    <Button
                      size="sm"
                      variant={post.isLiked ? 'secondary' : 'primary'}
                      onClick={() => handleLike(post.id)}
                      disabled={isLiking}
                    >
                      {post.isLiked ? 'Unlike' : 'Like'} ({post.likeCount ?? 0})
                    </Button>
                    <Button as={Link} to={`/post/${post.id}`} size="sm" variant="outline">
                      View
                    </Button>
                  </Flex>

                  {canDeletePost(post) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(post.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </Button>
                  )}
                </Flex>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export { HomePage };
