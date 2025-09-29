import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../../services/postService';
import { useComments } from '../../hooks/useComments';
import { Container, Box, Button, Text, Heading } from '../../components/ui';
import { Post, Comment } from '../../types';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? Number(id) : null;
  const [post, setPost] = useState<Post | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyParentId, setReplyParentId] = useState<number | undefined>(undefined);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  // Use apenas o hook para comentários
  const {
    comments,
    loading: commentsLoading,
    addComment,
    refreshComments,
  } = useComments(postId);

  // Estado de loading do post
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postService.getPostById(Number(id));
        setPost(res.post);
      } catch (err) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      setLiked(post.isLiked ?? false);
      setLikeCount(post.likeCount ?? 0);
    }
  }, [post]);

  // Removido o useEffect que buscava comentários manualmente

  const handleLike = async () => {
    if (!post) return;
    try {
      const res = await postService.likePost(post.id);
      setLiked(res.liked);
      setLikeCount(prev => res.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.log(err)
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !postId) return;
    try {
      await addComment(commentContent, replyParentId);
      setCommentContent('');
      setReplyParentId(undefined);
      await refreshComments();
    } catch (err) {
      console.log(err);
    }
  };

  const renderComments = (comments: Comment[], parentId: number | null = null) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <Box key={comment.id} ml={parentId ? 6 : 0} mt={2} p={2} border="1px solid #eee" borderRadius="md">
          <Text>
            <strong>
              {comment.author ? comment.author.username : 'Usuário removido'}:
            </strong> {comment.content}
          </Text>
          <Button size="sm" onClick={() => setReplyParentId(comment.id)}>Responder</Button>
          {comment.replies && comment.replies.length > 0 && (
            <Box ml={4}>
              {renderComments(comment.replies, comment.id)}
            </Box>
          )}
        </Box>
      ));
  };

  if (loading) {
    return <Text textAlign="center">Carregando...</Text>;
  }

  if (!post) {
    return <Text textAlign="center">Post não encontrado.</Text>;
  }

  return (
    <Container maxWidth="700px" mx="auto">
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading as="h1" mb={4}>
          {post.title}
        </Heading>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <strong>Autor:</strong>
          <span style={{ marginLeft: 6 }}>{post.author.username}</span>
          {post.author.avatar && (
            <img src={post.author.avatar} alt={post.author.username} style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8 }} />
          )}
        </div>
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} style={{ maxWidth: '100%', margin: '1rem 0', borderRadius: 8 }} />
        )}
        <Text mb={2}><strong>Resumo:</strong> {post.excerpt ?? ''}</Text>
        <Text mb={2}><strong>Conteúdo:</strong> {post.content}</Text>
        <div>
          <strong>Tags:</strong> {(post.tags ?? []).join(', ')}
        </div>
        <div>
          <strong>Publicado em:</strong> {new Date(post.publishedAt).toLocaleString()}
        </div>
        <div>
          <strong>Visualizações:</strong> {post.viewCount}
        </div>
        <div>
          <div style={{ margin: '16px 0' }}>
            <button
              onClick={handleLike}
              style={{
                background: liked ? 'black' : 'white',
                color: liked ? 'white' : 'black',
                border: '1px solid black',
                borderRadius: 20,
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              <span style={{
                display: 'inline-block',
                width: 20,
                height: 20,
                border: liked ? 'none' : '1px solid black',
                borderRadius: '50%',
                background: liked ? 'black' : 'white',
                color: liked ? 'white' : 'black',
                textAlign: 'center',
                lineHeight: '20px',
                fontSize: 18
              }}>
                ♥
              </span>
              Like
              <span style={{ marginLeft: 8 }}>{likeCount}</span>
            </button>
          </div>
          <strong>Comentários:</strong>
          <Box mt={4}>
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={commentContent}
                onChange={e => setCommentContent(e.target.value)}
                placeholder={replyParentId ? "Responder comentário..." : "Adicionar comentário..."}
                rows={3}
                style={{ width: '100%', marginBottom: 8 }}
              />
              <Button type="submit" size="sm">
                {replyParentId ? "Responder" : "Comentar"}
              </Button>
              {replyParentId && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  style={{ marginLeft: 8 }}
                  onClick={() => setReplyParentId(undefined)}
                >
                  Cancelar resposta
                </Button>
              )}
            </form>
            {commentsLoading ? (
              <Text>Carregando comentários...</Text>
            ) : comments.length === 0 ? (
              <Text>Nenhum comentário ainda.</Text>
            ) : (
              renderComments(comments)
            )}
          </Box>
        </div>
      </Box>
    </Container>
  );
};