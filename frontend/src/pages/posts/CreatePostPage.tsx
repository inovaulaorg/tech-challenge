import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Box, Heading, Button, Flex } from '../../components/ui';
import { Form, FormGroup, Label, Input, TextArea, HelpText, ErrorText } from '../../components/forms';
import { usePostsAdvanced } from '../../hooks/usePostsAdvanced';
import { CreatePostRequest } from '../../types';

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPost, isCreating } = usePostsAdvanced({ enabled: false });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const normalizeTags = (value: string): string[] | undefined => {
    const trimmed = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    return trimmed.length > 0 ? trimmed : undefined;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are required.');
      return;
    }

    const payload: CreatePostRequest = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      tags: normalizeTags(tags),
    };

    try {
      const response = await createPost(payload);
      toast.success('Post created successfully.');
      navigate(`/post/${response.post.id}`);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Unable to create post.';
      setFormError(message);
    }
  };

  return (
    <Container maxWidth="720px" py={8}>
      <Box mb={6}>
        <Heading as="h1">Create a New Post</Heading>
        <HelpText mt={2}>
          Fill out the form below to publish a new post. Title and content are required.
        </HelpText>
      </Box>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Amazing blog post"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            hasError={!!formError && !title.trim()}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input
            id="excerpt"
            placeholder="A short summary of your post"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
          />
          <HelpText>Shown on the home page. Optional.</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">Content</Label>
          <TextArea
            id="content"
            placeholder="Write your post content here..."
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
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="technology, javascript, design"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
          <HelpText>Separate tags with commas. Example: product, ux, backend</HelpText>
        </FormGroup>

        {formError && (
          <ErrorText role="alert">{formError}</ErrorText>
        )}

        <Flex gap={3}>
          <Button type="submit" isLoading={isCreating} disabled={isCreating}>
            Publish Post
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </Flex>
      </Form>
    </Container>
  );
};

export { CreatePostPage };
