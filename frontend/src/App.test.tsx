import React from 'react';
import { render, screen } from '@testing-library/react';
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

jest.mock('./hooks/useAuth', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('./hooks/usePostsAdvanced', () => ({
  usePostsAdvanced: jest.fn(),
}));

import { useAuth } from './hooks/useAuth';
import { usePostsAdvanced } from './hooks/usePostsAdvanced';

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUsePostsAdvanced = usePostsAdvanced as jest.MockedFunction<typeof usePostsAdvanced>;

type UsePostsReturn = ReturnType<typeof usePostsAdvanced>;

type PartialUsePostsReturn = UsePostsReturn extends object ? Partial<UsePostsReturn> : Partial<Record<string, unknown>>;

const createPostsHookValue = (overrides: PartialUsePostsReturn = {}): UsePostsReturn => ({
  posts: [],
  pagination: undefined as any,
  isLoading: false,
  isFetching: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLiking: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  likeError: null,
  refetch: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
  likePost: jest.fn(),
  canEditPost: jest.fn(),
  canDeletePost: jest.fn(),
  resetCreateError: jest.fn(),
  resetUpdateError: jest.fn(),
  resetDeleteError: jest.fn(),
  resetLikeError: jest.fn(),
  ...overrides,
});

describe('App', () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('ReactDOMTestUtils.act')) {
        return;
      }
      originalError(...args);
    };

    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
        return;
      }
      originalWarn(...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
    });

    mockedUsePostsAdvanced.mockReturnValue(createPostsHookValue());
    localStorage.clear();
  });

  test('shows loading state while posts are being fetched', () => {
    mockedUsePostsAdvanced.mockReturnValue(
      createPostsHookValue({
        isLoading: true,
      })
    );

    render(<App />);

    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  test('shows login link for unauthenticated user', () => {
    mockedUsePostsAdvanced.mockReturnValue(
      createPostsHookValue({
        isLoading: false,
        posts: [],
      })
    );

    render(<App />);

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  test('renders posts when data is available', () => {
    mockedUsePostsAdvanced.mockReturnValue(
      createPostsHookValue({
        isLoading: false,
        posts: [
          {
            id: 1,
            title: 'First Post',
            content: 'Content preview',
            excerpt: 'Content preview',
            tags: ['react'],
            isLiked: false,
            likeCount: 5,
            authorId: 1,
            isPublished: true,
            viewCount: 10,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          } as any,
        ],
      })
    );

    render(<App />);

    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText(/content preview/i)).toBeInTheDocument();
  });
});
