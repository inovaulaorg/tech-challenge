import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Box, Heading, Text, Button } from '../../components/ui';
import { Form } from '../../components/forms';
import { InputField } from '../../components/forms/InputField';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../types';
import { toast } from 'react-toastify';
import { mail } from 'react-icons-kit/feather/mail';
import { ic_vpn_key_outline } from 'react-icons-kit/md/ic_vpn_key_outline'


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled(Box)`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
`;

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
      setIsLoading(true);
      try {
        await login(data.email, data.password);
        toast.success('Logged in successfully!');
        onClose();
        navigate('/posts');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Login failed');
      } finally {
        setIsLoading(false);
      }
    };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <Heading as="h1" textAlign="center" mb={6}>
          Welcome Back
        </Heading>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            icon={mail}
            error={errors.email?.message}
            {...register('email', {
                required: 'Email is required',
                pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                },
            })}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={ic_vpn_key_outline}
            error={errors.password?.message}
            {...register('password', {
                required: 'Password is required',
                minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                },
            })}
            />

            <Button
                type="submit"
                isLoading={isLoading}
                isDisabled={isLoading}
                >
                {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
        </Form>

        <Text textAlign="center" mt={6} color="gray.600">
          Don't have an account?{' '}
          <Link to="/register" onClick={onClose}>
            Sign up here
          </Link>
        </Text>
      </ModalContent>
    </Overlay>
  );
};
