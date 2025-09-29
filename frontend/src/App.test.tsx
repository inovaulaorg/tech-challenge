// src/App.test.tsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, useParams, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { ProfilePage } from '../src/pages/auth/ProfilePage';
import { RegisterPage } from '../src/pages/auth/RegisterPage';
import { PostsPage } from '../src/pages/posts/PostsPage';
import { CreatePostPage } from '../src/pages/posts/CreatePostPage';
import { HomePage } from '../src/pages/posts/HomePage';
import { PostDetailPage } from '../src/pages/posts/PostDetailPage';
import { authService } from '../src/services/authService';
import { postService } from '../src/services/postService';
import { uploadService } from '../src/services/uploadService';
import { commentService } from '../src/services/commentService';
import { User, Post, PostsResponse, Comment, CommentsResponse } from '../src/types';
import { theme } from '../src/styles/theme';
import styled from 'styled-components';

// --- Mock Services ---
jest.mock('../src/services/authService');
jest.mock('../src/services/postService');
jest.mock('../src/services/uploadService');
jest.mock('../src/services/commentService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
    })),
  },
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;
const mockedPostService = postService as jest.Mocked<typeof postService>;
const mockedUploadService = uploadService as jest.Mocked<typeof uploadService>;
const mockedCommentService = commentService as jest.Mocked<typeof commentService>;
const mockedUseParams = useParams as jest.Mock;

// --- Mocks ---
const mockUser: User = {
  id: 1,
  username: 'TestUser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockPosts: Post[] = [
  {
    id: 1,
    title: 'Post 1',
    content: 'Content of Post 1',
    excerpt: 'Excerpt of Post 1',
    imageUrl: 'https://via.placeholder.com/150',
    tags: ['tag1', 'tag2'],
    isPublished: true,
    viewCount: 10,
    authorId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: 0,
    isLiked: false,
  },
  {
    id: 2,
    title: 'Post 2',
    content: 'Content of Post 2',
    isPublished: false,
    viewCount: 5,
    authorId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: 0,
    isLiked: false,
  },
];

const mockComments: Comment[] = [
  {
    id: 1,
    content: 'First comment',
    postId: 1,
    authorId: 2,
    isApproved: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      id: 2,
      username: 'Commenter',
      email: 'commenter@example.com',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

const mockPostsResponse: PostsResponse = {
  posts: mockPosts,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 2,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const mockCommentsResponse: CommentsResponse = {
  comments: mockComments,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: mockComments.length,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const mockUploadResponse = {
  message: 'Uploaded',
  file: {
    url: 'https://via.placeholder.com/200',
    key: 'test-key',
    bucket: 'test-bucket',
    etag: '12345',
  },
};

// --- Helper para renderizar com tema ---
const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div>{ui}</div>
      </ThemeProvider>
    </BrowserRouter>
  );

// --- ProfilePage ---
describe('ProfilePage', () => {
  beforeEach(() => {
    mockedAuthService.getProfile.mockResolvedValue({ user: mockUser });
    mockedPostService.getPosts.mockResolvedValue(mockPostsResponse);
  });

  it('renders profile info and posts', async () => {
    renderWithProviders(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText(mockUser.username)).toBeInTheDocument();
      mockPosts.forEach(post => expect(screen.getByText(post.title)).toBeInTheDocument());
    });
  });

  it('opens edit modal', async () => {
    renderWithProviders(<ProfilePage />);
    await waitFor(() => screen.getByText(/edit profile/i));
    fireEvent.click(screen.getByText(/edit profile/i));
    expect(screen.getByText(/update/i)).toBeInTheDocument();
  });
});

// --- RegisterPage ---
describe('RegisterPage', () => {
  const formFields = [
    { label: /username/i, value: 'leo123' },
    { label: /email/i, value: 'leo@example.com' },
    { label: /password/i, value: '123456' },
    { label: /first name/i, value: 'Leonardo' },
    { label: /last name/i, value: 'Ibiapina' },
  ];

  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields and submit button', () => {
    renderWithProviders(<RegisterPage />);

    // Checa cada input
    formFields.forEach(field => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });

    // Checa botão de submit
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows typing into all fields', async () => {
    renderWithProviders(<RegisterPage />);

    for (const field of formFields) {
      const input = screen.getByLabelText(field.label) as HTMLInputElement;
      await userEvent.type(input, field.value);
      expect(input).toHaveValue(field.value);
    }
  });

  test('submits the form successfully', async () => {
    (authService.register as jest.Mock).mockResolvedValueOnce({});
    renderWithProviders(<RegisterPage />);

    // Preenche o formulário
    for (const field of formFields) {
      const input = screen.getByLabelText(field.label) as HTMLInputElement;
      await userEvent.type(input, field.value);
    }

    // Clica no botão de submit
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(submitButton);

    expect(authService.register).toHaveBeenCalledWith({
      username: 'leo123',
      email: 'leo@example.com',
      password: '123456',
      firstName: 'Leonardo',
      lastName: 'Ibiapina',
    });
  });
});


// --- PostsPage ---
describe('PostsPage', () => {
  beforeEach(() => mockedPostService.getPosts.mockResolvedValue(mockPostsResponse));

  it('renders grid and pagination', async () => {
    renderWithProviders(<PostsPage />);
    await waitFor(() => {
      expect(screen.getByText(/all posts/i)).toBeInTheDocument();
      mockPosts.forEach(post => expect(screen.getByText(post.title)).toBeInTheDocument());
    });
  });
});

// --- CreatePostPage ---
describe('CreatePostPage', () => {
  beforeEach(() => {
    mockedUploadService.uploadImage.mockResolvedValue(mockUploadResponse);
    mockedPostService.createPost.mockResolvedValue({
      message: 'Post created successfully',
      post: { ...mockPosts[0], id: 3, title: 'New Post', content: 'New content', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isPublished: true, viewCount: 0, likeCount: 0, authorId: mockUser.id },
    });
  });

  it('renders form and handles input', () => {
    renderWithProviders(<CreatePostPage />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Post' } });
    fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tag1,tag2' } });
    expect(screen.getByDisplayValue('New Post')).toBeInTheDocument();
  });

  it('uploads image', async () => {
    renderWithProviders(<CreatePostPage />);
    const file = new File(['dummy'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/choose image/i);
    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);
    await waitFor(() => expect(mockedUploadService.uploadImage).toHaveBeenCalledWith(file));
  });
});

// --- HomePage ---
describe('HomePage', () => {
  beforeEach(() => mockedPostService.getPosts.mockResolvedValue(mockPostsResponse));

  it('renders recent posts', async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => mockPosts.forEach(post => expect(screen.getByText(post.title)).toBeInTheDocument()));
  });
});

// --- PostDetailPage ---
describe('PostDetailPage', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ id: '1' });
    mockedPostService.getPostById.mockResolvedValue({ post: { ...mockPosts[0], comments: mockComments } });
    mockedPostService.likePost.mockResolvedValue({ message: 'Liked', liked: true });
    mockedCommentService.getComments.mockResolvedValue(mockCommentsResponse);
  });

  it('renders post details and comments', async () => {
    renderWithProviders(<PostDetailPage />);
    await waitFor(() => {
      expect(screen.getByText(mockPosts[0].title)).toBeInTheDocument();
      expect(screen.getByText(mockComments[0].content)).toBeInTheDocument();
    });
  });

  it('handles like click', async () => {
    renderWithProviders(<PostDetailPage />);

    // busca pelo botão de like pelo texto visível "Like (#)"
    const likeButton = await screen.findByText(/like\s*\(\d+\)/i);
    fireEvent.click(likeButton);

    await waitFor(() => expect(mockedPostService.likePost).toHaveBeenCalled());
  });
});
