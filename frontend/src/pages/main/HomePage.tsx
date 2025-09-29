import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/postService';

export const HomePage: React.FC = () => {
  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await postService.getPosts();
        console.log(posts);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, textAlign: 'center', border: '1px solid #eee', borderRadius: 8 }}>
      <h1>Bem-vindo ao Tech Challenge!</h1>
      <p>Este é o sistema de posts. Faça login, registre-se ou crie um novo post.</p>
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 16 }}>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Registrar</button>
        </Link>
        <Link to="/create">
          <button>Criar Post</button>
        </Link>
        <Link to="/posts">
          <button>Ver posts</button>
        </Link>
      </div>
    </div>
  );
};