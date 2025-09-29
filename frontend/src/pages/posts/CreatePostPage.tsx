import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Box, Heading, Button } from '../../components/ui';
import { Form, FormGroup, Label, Input, TextArea, ErrorText } from '../../components/forms';
import { postService } from '../../services/postService';

interface CreatePostForm {
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  tags?: string;
}

export const CreatePostPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostForm>();

 const onSubmit = async (data: CreatePostForm) => {
    setIsLoading(true);
    try {
      await postService.createPost({
        ...data,
        tags: data.tags ? data.tags.split(', ').map(tag => tag.trim()) : [],
        excerpt: data.excerpt || '',
        imageUrl: data.imageUrl || '',
      });
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="600px" mx="auto">
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading as="h1" textAlign="center" mb={6}>
          Create a New Post
        </Heading>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter the title"
              hasError={!!errors.title}
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Content</Label>
            <TextArea
              id="content"
              placeholder="Write your post content here..."
              rows={6}
              hasError={!!errors.content}
              {...register('content', { required: 'Content is required' })}
            />
            {errors.content && <ErrorText>{errors.content.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Excerpt</Label>
            <Input
              id="excerpt"
              type="text"
              placeholder="Short summary (optional)"
              {...register('excerpt')}
            />
          </FormGroup>

          <FormGroup>
            <Label>Image URL</Label>
            <Input
              id="imageUrl"
              type="text"
              placeholder="Image URL (optional)"
              {...register('imageUrl')}
            />
          </FormGroup>

          <FormGroup>
            <Label>Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="Comma separated tags (e.g. tech, react) (optional)"
              {...register('tags')}
            />
          </FormGroup>

          <Button
            type="submit"
            style={{ width: '100%' }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </Form>
      </Box>
    </Container>
  );
};