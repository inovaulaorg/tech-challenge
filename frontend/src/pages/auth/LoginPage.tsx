import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Box, Heading, Text, Button } from '../../components/ui';
import { useTheme } from 'styled-components';
import { Form, FormGroup, Label, Input, ErrorText } from '../../components/forms';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types';
import { toast } from 'react-toastify';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      clearErrors();
      // Try to log in
      await login(data.email, data.password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      // If credentials are invalid (401) show inline error under password
      if (error.response?.status === 401) {
        setError('password' as any, { type: 'server', message });
      } else {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container style={{ maxWidth: 400, margin: '0 auto' }}>
      <Box
        style={{
          background: theme.colors.white,
          padding: theme.space[8],
          borderRadius: theme.radii.lg,
          boxShadow: theme.shadows.md,
        }}
      >
        <Heading as="h1" style={{ textAlign: 'center', marginBottom: theme.space[6] }}>
          Welcome Back
        </Heading>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              hasError={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              hasError={!!errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <Text as="span" style={{ textAlign: 'center', marginTop: theme.space[6], color: theme.colors.gray[600], display: 'block' }}>
          Don't have an account?{' '}
          <Link to="/register">
            Sign up here
          </Link>
        </Text>
      </Box>
    </Container>
  );
};