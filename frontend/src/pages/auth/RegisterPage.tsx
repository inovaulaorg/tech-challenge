import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Box, Text, Heading, Button } from '../../components/ui/index';
import { Form } from '../../components/forms';
import { InputField } from '../../components/forms/InputField';
import { RegisterRequest } from '../../types/index';
import { authService } from '../../services/authService';
import { mail } from 'react-icons-kit/feather/mail';
import { ic_vpn_key_outline } from 'react-icons-kit/md/ic_vpn_key_outline'
import { LoginModal } from '../../components/modals/LoginModal';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(form);
      toast.success('Account Created Successfully!');
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Sign-Up Error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      display="flex"
      flexDirection={{ _: 'column', md: 'row' }}
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={8}
      padding={4}
    >
        <Box
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={{ _: 6, md: 0 }}
        >
            <img
            src="/undraw_sign-up_qamz.svg"
            alt="Sign-Up Illustration"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '1rem' }}
            />
        </Box>
        <Box
            backgroundColor="white"
            borderRadius="xl"
            boxShadow="0 10px 40px rgba(0,0,0,0.15)"
            padding={{ _: 4, md: 6 }}
            width={{ _: '100%', md: '400px' }}
        >
            <Box textAlign="center" mb={6}>
            <Heading as="h1" color="gray.900" mb={2}>Join Us</Heading>
            <Text as="p" variant="body" color="gray.400">
                Enter your details below to begin.
            </Text>
            </Box>

            <Form onSubmit={handleSubmit}>
            <InputField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Username"
            />
            <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                icon={mail}
                placeholder="Email"
            />
            <InputField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                icon={ic_vpn_key_outline}
                placeholder="Password"
            />
            <InputField
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
            />
            <InputField
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
            />

            <Button type="submit" variant="primary" size="md" isLoading={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
            </Form>

            <Box mt={4} textAlign="center">
            <Text as="span" variant="body" color="gray.400">
                Already have an account?{' '}
                <Button variant="ghost" onClick={openLoginModal} color="primary.500">
                Log In
                </Button>
            </Text>
            </Box>
        </Box>

        {/* Login Modal */}
        {isLoginOpen && <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />}
        </Container>
  );
};
