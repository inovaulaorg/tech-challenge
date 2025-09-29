import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { postService } from '../../services/postService';
import { commentService } from '../../services/commentService';
import { Post, Comment, CreateCommentRequest } from '../../types';
import { Text, Heading } from '../../components/ui';
import { LikeButton } from '../../components/ui/LikeButton';
import { CommentInput } from '../../components/forms/CommentInput';
import { CommentItem } from '../../components/ui/CommentItem';


export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const fetchPost = async () => {
    try {
      const res = await postService.getPostById(postId);
      setPost(res.post);
    } catch (err) {
      console.error('Erro ao carregar post:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await commentService.getComments(postId);
      setComments(res.comments);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPost(), fetchComments()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleLike = async () => {
    if (!post) return;
    setLikeLoading(true);
    try {
      const res = await postService.likePost(post.id);
      setPost({
        ...post,
        isLiked: res.liked,
        likeCount: post.likeCount + (res.liked ? 1 : -1),
      });
    } catch (err) {
      console.error('Erro ao curtir:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    try {
      const newComment: CreateCommentRequest = {
        content: commentContent,
        postId: postId,
      };
      const res = await commentService.createComment(newComment);
      setComments([res.comment, ...comments]);
      setCommentContent('');
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  if (loading) return <Loading>Loading post...</Loading>;
  if (!post) return <Loading>Post not found</Loading>;

  return (
    <Container>
      {post.imageUrl && <Banner src={post.imageUrl} alt={post.title} />}
      <Article>
        <Heading as="h1" mb={4}>{post.title}</Heading>
        <Meta>
          <Text as="span">
            {post.author?.username || 'Unknown author'} •{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
          <Text as="span">{post.viewCount} views</Text>
        </Meta>

        <Content dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Likes */}
        <LikeSection>
          <LikeButton
            liked={post.isLiked ?? false}
            count={post.likeCount}
            onClick={handleLike}
        />
        </LikeSection>

        {/* Comments */}
        <CommentsSection>
          <Heading as="h2" mb={3}>Comments ({comments.length})</Heading>
          <CommentInput
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onSubmit={handleCommentSubmit}
            disabled={likeLoading}
            />


          {comments.length === 0 ? (
            <Text>No comments yet. Be the first!</Text>
          ) : (
            <CommentList>
              {comments.map((c) => (
                <CommentItem
                key={c.id}
                comment={c}
                postId={postId}
                currentUserId={post.author?.id}
                onCommentUpdate={(updated) => {
                    const index = comments.findIndex((x) => x.id === updated.id);
                    if (index > -1) comments[index] = updated;
                    setComments([...comments]);
                }}
                onCommentDelete={(id) => {
                    setComments(comments.filter((x) => x.id !== id));
                }}
                />
            ))}
            </CommentList>
          )}
        </CommentsSection>
      </Article>
    </Container>
  );
};

/* === Styled Components === */
const Container = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Banner = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-bottom: 2rem;
`;

const Article = styled.article`
  background: #fff;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Content = styled.div`
  font-size: 1.05rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: 2rem;
`;

const LikeSection = styled.div`
  margin-bottom: 2rem;
`;

const CommentsSection = styled.section`
  margin-top: 2rem;
`;

const CommentList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Loading = styled.p`
  text-align: center;
  padding: 2rem;
`;
