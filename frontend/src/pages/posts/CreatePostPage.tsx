import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Heading, Text, Button } from '../../components/ui';
import { InputField } from '../../components/forms/InputField';
import { Form, TextArea } from '../../components/forms';
import { FileInputWrapper, FileInputStyled, FileInputButton } from '../../components/forms/index';
import { postService } from '../../services/postService';
import { uploadService } from '../../services/uploadService';
import { CreatePostRequest } from '../../types';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<{
    title: string;
    content: string;
    imageFile: File | null;
    imageUrl?: string;
    excerpt?: string;
    tags: string[];
    }>({
    title: '',
    content: '',
    imageFile: null,
    tags: [],
    });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Gerar preview da imagem
  useEffect(() => {
    if (form.imageFile) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(form.imageFile);
    } else {
      setImagePreview(null);
    }
  }, [form.imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
      };

      const handleFileChange = async (file: File) => {
      setForm((prev) => ({ ...prev, imageFile: file }));
      setUploading(true);

      // Gerar preview imediato
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const uploadResult = await uploadService.uploadImage(file);

        // Forçar loading de 4 segundos
        await new Promise((resolve) => setTimeout(resolve, 4000));

        setForm((prev) => ({ ...prev, imageUrl: uploadResult.file.url }));
      } catch (err) {
        console.error('Error uploading image', err);
      } finally {
        setUploading(false);
      }
    };


    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!form.title) newErrors.title = 'Title is required';
        if (!form.content) newErrors.content = 'Content is required';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
    }

    setLoading(true);
    try {
        const postData: CreatePostRequest = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || undefined,
        imageUrl: form.imageUrl,
        tags: form.tags.length > 0 ? form.tags : undefined,
        };

        await postService.createPost(postData);
        navigate('/posts');
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
    };

  return (
    <Container
      display="flex"
      flexDirection={{ _: 'column', md: 'row' }}
      alignItems="flex-start"
      justifyContent="center"
      minHeight="100vh"
      padding={4}
      gap={8}
    >
      {/* Formulário */}
      <Box
        flex="1"
        backgroundColor="white"
        borderRadius="xl"
        boxShadow="0 10px 40px rgba(0,0,0,0.1)"
        padding={{ _: 4, md: 6 }}
        width={{ _: '100%', md: '500px' }}
      >
        <Heading as="h1" color="gray.900" mb={4}>
          Create a New Post
        </Heading>
        <Text as="p" variant="body" color="gray.500" mb={6}>
          Write your post content and upload an image to make it more engaging. Preview your post live on the right.
        </Text>

        <Form onSubmit={handleSubmit}>
          <InputField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter post title"
          />

          <TextArea
            placeholder="Write your content here..."
            name="content"
            value={form.content}
            onChange={handleChange}
            hasError={!!errors.content}
          />
          {errors.content && <Text color="red.500">{errors.content}</Text>}

          <InputField
            label="Excerpt"
            name="excerpt"
            value={form.excerpt || ''}
            onChange={handleChange}
            placeholder="Write a short summary of your post"
            />

            <InputField
            label="Tags"
            name="tags"
            value={form.tags?.join(', ') || ''}
            onChange={(e) => {
                const tagsArray = e.target.value.split(',').map(tag => tag.trim());
                setForm(prev => ({ ...prev, tags: tagsArray }));
            }}
            placeholder="Add tags separated by commas"
            />

          <FileInputWrapper>
            <FileInputButton>
              {form.imageFile ? form.imageFile.name : uploading ? 'Uploading...' : 'Choose Image'}
            </FileInputButton>
            <FileInputStyled
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
          </FileInputWrapper>

          <Button type="submit" variant="primary" size="md" isLoading={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </Form>
      </Box>

      {/* Preview */}
      <Box
        flex="1"
        backgroundColor="gray.50"
        borderRadius="xl"
        boxShadow="0 10px 40px rgba(0,0,0,0.05)"
        padding={4}
        width={{ _: '100%', md: '500px' }}
        minHeight="400px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
      >
        <Heading as="h2" color="gray.900" mb={4} fontSize="xl">
          Preview
        </Heading>
        {imagePreview && (
        <Box mb={4} width="100%" display="flex" justifyContent="center">
          {uploading ? (
            <Text>Loading preview...</Text>
          ) : (
            <img
              src={imagePreview}
              alt="Post preview"
              style={{ maxWidth: '100%', borderRadius: '0.75rem' }}
            />
          )}
        </Box>
        )}
        <Heading as="h3" color="gray.800" mb={2} fontSize="lg">
          {form.title || 'Post Title'}
        </Heading>
        <Text as="p" variant="body" color="gray.600">
          {form.content || 'Your post content will appear here...'}
        </Text>
      </Box>



    </Container>
  );
};
