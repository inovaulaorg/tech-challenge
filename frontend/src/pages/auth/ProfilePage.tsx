import { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { authService } from '../../services/authService';
import { postService } from '../../services/postService';
import { User, Post } from '../../types';
import { Button, Text, Heading } from '../../components/ui';
import { Link } from 'react-router-dom';
import { InputField } from '../../components/forms/InputField';
import { Icon } from 'react-icons-kit';
import {edit} from 'react-icons-kit/feather/edit'

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const closeEditPostModal = () => {
    setEditingPost(null);
    setIsEditPostModalOpen(false);
  };

  const [postEditData, setPostEditData] = useState<{ title: string; content: string ; excerpt: string}>({
    title: '',
    content: '',
    excerpt: ''
  });


  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);


  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      setUser(res.user);
      setEditData({
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        username: res.user.username,
        email: res.user.email,
      });
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  };

  const fetchPosts = useCallback(async () => {
    if (!user) return;

    try {
      setPostLoading(true);
      const res = await postService.getPosts({
        authorId: user.id,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
      setPosts(res.posts);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
    } finally {
      setPostLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchProfile().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleUpdate = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const res = await authService.updateProfile(editData);
      setUser(res.user);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
        await postService.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
        console.error('Erro ao deletar post:', err);
    }
    };

  const handleOpenEditPost = (post: Post) => {
    setEditingPost(post);
    setPostEditData({ title: post.title, content: post.content , excerpt: post.excerpt || ''});
    setIsEditPostModalOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    try {
      const res = await postService.updatePost(editingPost.id, {
        title: postEditData.title,
        content: postEditData.content,
        excerpt: postEditData.excerpt
      });
      setPosts(posts.map(p => (p.id === res.post.id ? res.post : p)));
      closeEditPostModal();
    } catch (err) {
      console.error('Erro ao atualizar post:', err);
    }
  };


  if (loading) return <Loading>Loading profile...</Loading>;
  if (!user) return <Loading>User not found</Loading>;

  return (
    <Container>
      <ProfileHeader>
         <Avatar>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</Avatar>
        <ProfileInfo>
          <Heading as="h1">{user.username}</Heading>
          <Text>
            {user.firstName || ''} {user.lastName || ''}
          </Text>
        </ProfileInfo>
      </ProfileHeader>

      <Button variant="primary" size="sm" onClick={openEditModal}>
        Edit Profile
      </Button>


      <PostsSection>
        <Heading as="h2">Your Posts</Heading>
        {postLoading ? (
          <Text>Loading posts...</Text>
        ) : posts.length === 0 ? (
          <Text>No posts yet</Text>
        ) : (
          <PostsGrid>
            {posts.map(post => (
              <PostCard key={post.id}>
                {post.imageUrl && <PostImage src={post.imageUrl} alt={post.title} />}
                <PostContent>
                  <Link to={`/posts/${post.id}`}>
                    <Text variant='heading' color={'gray.800'}>{post.title}</Text>
                  </Link>
                  <Text variant='caption'><br />{post.excerpt || post.content.slice(0, 100) + '...'}</Text>
                </PostContent>
                <ButtonIcon onClick={() => handleOpenEditPost(post)}>
                  <Icon icon={edit} size={16} />
                </ButtonIcon>
                <Button variant='danger' onClick={() => handleDeletePost(post.id)}>Delete</Button>
              </PostCard>
            ))}
          </PostsGrid>
        )}
      </PostsSection>

      {isEditModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <Heading as="h2">Edit Profile</Heading>
              <InputField
                name="firstName"
                label="First Name"
                value={editData.firstName || ''}
                onChange={e => setEditData({ ...editData, firstName: e.target.value })}
              />
              <InputField
                name="lastName"
                label="Last Name"
                value={editData.lastName || ''}
                onChange={e => setEditData({ ...editData, lastName: e.target.value })}
              />
              <InputField
                name="username"
                label="Username"
                value={editData.username || ''}
                onChange={e => setEditData({ ...editData, username: e.target.value })}
              />
              <InputField
                name="email"
                label="Email"
                value={editData.email || ''}
                onChange={e => setEditData({ ...editData, email: e.target.value })}
              />
            <ModalButtons>
              <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
              <Button onClick={async () => {
                await handleUpdate();
                closeEditModal();
              }} disabled={updating}>
                {updating ? 'Updating...' : 'Update'}
              </Button>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {isEditPostModalOpen && editingPost && (
      <ModalOverlay>
        <ModalContent>
          <Heading as="h2">Edit Post</Heading>
          <InputField
            name="title"
            label="Title"
            placeholder="Title"
            value={postEditData.title}
            onChange={e => setPostEditData({ ...postEditData, title: e.target.value })}
          />
          <InputField
            name="excerpt"
            label="Excerpt"
            placeholder="Excerpt"
            value={postEditData.excerpt}
            onChange={e => setPostEditData({ ...postEditData, excerpt: e.target.value })}
          />
          <InputField
            name="content"
            label="Content"
            placeholder="Content"
            value={postEditData.content}
            onChange={e => setPostEditData({ ...postEditData, content: e.target.value })}
          />
          <ModalButtons>
            <Button variant="outline" onClick={closeEditPostModal}>Cancel</Button>
            <Button onClick={handleUpdatePost}>Update</Button>
          </ModalButtons>
        </ModalContent>
      </ModalOverlay>
    )}
    </Container>
  );
};

/* === Styled Components === */
const Container = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Loading = styled.p`
  text-align: center;
  padding: 2rem;
`;

const ProfileHeader = styled.section`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ButtonIcon = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 3rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary[500]};
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.radii.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;


const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.xl};
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PostsSection = styled.section`
  margin-top: 2rem;
`;

const PostsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const PostCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const PostImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const PostContent = styled.div`
  padding: 1rem;
  flex: 1;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

