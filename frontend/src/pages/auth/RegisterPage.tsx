import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Box, Heading, Text, Button } from '../../components/ui';
import { Form, FormGroup, Label, Input, ErrorText } from '../../components/forms';
import { useAuth } from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';
import { toast } from 'react-toastify';

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    const payload = {
      ...data,
      firstName: data.firstName?.trim() ? data.firstName : undefined,
      lastName: data.lastName?.trim() ? data.lastName : undefined,
    };
    try {
        await registerUser(payload);
        toast.success('Account created successfully!');
        navigate('/login');
    } catch (error: any) {
        toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="400px" mx="auto">
      <Box 
        bg="white" 
        p={8} 
        borderRadius="lg" 
        boxShadow="md"
      >
        <Heading as="h1" textAlign="center" mb={6}>
          Create an Account
        </Heading>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              hasError={!!errors.username}
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 2,
                  message: 'Username must be at least 2 characters',
                },
              })}
            />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
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
            <Label>Password</Label>
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

          <FormGroup>
            <Label>First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name (optional)"
              hasError={!!errors.firstName}
              {...register('firstName', {
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              })}
            />
            {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name (optional)"
              hasError={!!errors.lastName}
              {...register('lastName', {
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              })}
            />
            {errors.lastName && <ErrorText>{errors.lastName.message}</ErrorText>}
          </FormGroup>
          
          <Button 
            type="submit" 
            style={{ width: '100%' }}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form>
        
        <Text textAlign="center" mt={6} color="gray.600">
          Already have an account?{' '}
          <Link to="/login">
            Log in here
          </Link>
        </Text>
      </Box>
    </Container>
  );
};