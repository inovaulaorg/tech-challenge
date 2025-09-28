import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => {
  const mockInterceptors = {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  };

  const mockAxiosInstance = {
    interceptors: mockInterceptors,
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      interceptors: mockInterceptors,
    },
  };
});

beforeEach(() => {
  localStorage.clear();
});

test('renders home placeholder content', async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/Home Page - Coming Soon/i)).toBeInTheDocument();
  });
});

test('shows login link for unauthenticated user', async () => {
  render(<App />);

  const loginLink = await screen.findByRole('link', { name: /login/i });
  expect(loginLink).toBeInTheDocument();
});
