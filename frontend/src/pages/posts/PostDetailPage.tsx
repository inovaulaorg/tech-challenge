import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Box, Heading, Text, Button, Flex } from '../../components/ui';
import { Form, FormGroup, Label, Input, TextArea, HelpText, ErrorText } from '../../components/forms';
import { usePost, usePostsAdvanced } from '../../hooks/usePostsAdvanced';
import { UpdatePostRequest } from '../../types';

const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = useMemo(() => Number(id), [id]);

  const { post, isLoading, error, refetch } = usePost(postId, !!postId);
  const {
    updatePost,
    deletePost,
    likePost,
    isUpdating,
    isDeleting,
    isLiking,
    canEditPost,
    canDeletePost,
  } = usePostsAdvanced({ enabled: false });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (post && isEditing) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setExcerpt(post.excerpt || '');
      setImageUrl(post.imageUrl || '');
      setTags(post.tags?.join(', ') || '');
    }
  }, [post, isEditing]);

  const handleStartEdit = () => {
    if (!post) {
      return;
    }
    setTitle(post.title || '');
    setContent(post.content || '');
    setExcerpt(post.excerpt || '');
    setImageUrl(post.imageUrl || '');
    setTags(post.tags?.join(', ') || '');
    setFormError(null);
    setIsEditing(true);
  };

  const normalizeTags = (value: string): string[] | undefined => {
    const trimmed = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    return trimmed.length > 0 ? trimmed : undefined;
  };

  const handleUpdate: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!post) {
      setFormError('Post data is not available.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are required.');
      return;
    }

    const payload: UpdatePostRequest = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      tags: normalizeTags(tags),
    };

    try {
      await updatePost(post.id, payload);
      toast.success('Post updated successfully.');
      await refetch();
      setIsEditing(false);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Unable to update post.';
      setFormError(message);
    }
  };

  const handleDelete = async () => {
    if (!post) {
      return;
    }

    try {
      const response = await deletePost(post.id);
      if (response) {
        toast.success('Post deleted successfully.');
        navigate('/');
      }
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Unable to delete post.';
      toast.error(message);
    }
  };

  const handleLike = async () => {
    if (!post) {
      return;
    }

    try {
      await likePost(post.id);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Unable to like post.';
      toast.error(message);
    }
  };

  if (!postId || Number.isNaN(postId)) {
    return (
      <Container py={8}>
        <Text color="red.500">Invalid post id.</Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container py={8}>
        <Text>Loading post...</Text>
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container py={8}>
        <Text color="red.500">Post not found.</Text>
      </Container>
    );
  }

  return (
    <Container maxWidth="720px" py={8}>
      {!isEditing ? (
        <Box>
          <Heading as="h1" mb={3}>{post.title}</Heading>
          <Text color="gray.500" mb={4}>
            {post.excerpt || 'No excerpt provided.'}
          </Text>

          {post.imageUrl && (
            <Box mb={4}>
              <img src={post.imageUrl} alt={post.title} style={{ width: '100%', borderRadius: 12 }} />
            </Box>
          )}

          <Text as="p" lineHeight="1.7" mb={5}>
            {post.content}
          </Text>

          {post.tags && post.tags.length > 0 && (
            <Flex flexWrap="wrap" gap={2} mb={5}>
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

          <Flex gap={3}>
            <Button onClick={handleLike} disabled={isLiking}>
              {post.isLiked ? 'Unlike' : 'Like'} ({post.likeCount ?? 0})
            </Button>
            {canEditPost(post) && (
              <Button variant="secondary" onClick={handleStartEdit}>
                Edit
              </Button>
            )}
            {canDeletePost(post) && (
              <Button variant="ghost" onClick={handleDelete} disabled={isDeleting}>
                Delete
              </Button>
            )}
          </Flex>
        </Box>
      ) : (
        <Box>
          <Heading as="h1" mb={4}>Edit Post</Heading>
          <Form onSubmit={handleUpdate}>
            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                hasError={!!formError && !title.trim()}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">Content</Label>
              <TextArea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                hasError={!!formError && !content.trim()}
                rows={10}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
              <HelpText>Separate tags with commas.</HelpText>
            </FormGroup>

            {formError && <ErrorText role="alert">{formError}</ErrorText>}

            <Flex gap={3}>
              <Button type="submit" isLoading={isUpdating} disabled={isUpdating}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setFormError(null);
                }}
              >
                Cancel
              </Button>
            </Flex>
          </Form>
        </Box>
      )}
    </Container>
  );
};

export { PostDetailPage };
