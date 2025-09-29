import { useState, useEffect, useCallback } from 'react';
import { postService, PostQuery } from '../services/postService';
import { Post, PostsResponse } from '../types';

export const usePosts = (initialQuery: PostQuery = {}) => {
  const [postsResponse, setPostsResponse] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<PostQuery>(initialQuery);

  const fetchPosts = useCallback(async (newQuery?: PostQuery) => {
    setLoading(true);
    setError(null);

    try {
      const queryToUse = newQuery || query;
      const response: PostsResponse = await postService.getPosts(queryToUse);
      setPostsResponse(response);
      if (newQuery) {
        setQuery(newQuery);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const refreshPosts = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts: postsResponse?.posts ?? [],
    pagination: postsResponse?.pagination,
    loading,
    error,
    query,
    fetchPosts,
    refreshPosts,
    setQuery,
    postsResponse, // caso queira acessar a resposta completa
  };
};