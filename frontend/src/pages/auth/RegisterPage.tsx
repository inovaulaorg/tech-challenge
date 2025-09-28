import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Box, Heading, Text, Button } from '../../components/ui';
import { useTheme } from 'styled-components';
import { Form, FormGroup, Label, Input, ErrorText } from '../../components/forms';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';
import { toast } from 'react-toastify';

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: 500, margin: '0 auto' }}>
      <Box
        style={{
          background: theme.colors.white,
          padding: theme.space[8],
          borderRadius: theme.radii.lg,
          boxShadow: theme.shadows.md,
        }}
      >
        <Heading as="h1" style={{ textAlign: 'center', marginBottom: theme.space[6] }}>
          Create an account
        </Heading>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              hasError={!!errors.username}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
            />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              hasError={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              hasError={!!errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <Button
            type="submit"
            style={{ width: '100%' }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </Form>

        <Text as="span" style={{ textAlign: 'center', marginTop: theme.space[6], color: theme.colors.gray[600], display: 'block' }}>
          Already have an account?{' '}
          <a href="/login">Sign in</a>
        </Text>
      </Box>
    </Container>
  );
};
