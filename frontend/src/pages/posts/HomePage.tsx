import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { postService } from '../../services/postService';
import { Post } from '../../types/index';
import { Link } from 'react-router-dom';
import { Button, Text, Heading } from '../../components/ui';

export const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await postService.getPosts({ limit: 20, sortBy: 'createdAt', sortOrder: 'DESC' });
        setPosts(res.posts);
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Share knowledge and discover new ideas</HeroTitle>
          <HeroSubtitle>
            Discover, publish, and discuss academic work in a single hub. The platform for learners, educators, and connectors.
          </HeroSubtitle>
        </HeroContent>
        <HeroImage
          src="./undraw_respond_o54z.svg"
          alt="An illustration representing the sharing of knowledge"
        />
      </HeroSection>

      <PostsSection>
        <Heading>Latest Additions</Heading>
        {loading ? (
          <Text>Loading recent shares...</Text>
        ) : posts.length === 0 ? (
          <NoPosts>
            <Text as="p">No materials have been shared yet. Why not be the first? Join the community to start sharing.</Text>
            <Button variant="primary" as={Link} to="/register" size="md">
              Sign Up
            </Button>
          </NoPosts>
        ) : (
          <PostsGrid>
            {posts.map((post) => (
              <PostCard key={post.id}>
                {post.imageUrl && <Image src={post.imageUrl} alt={post.title} />}
                <CardContent>
                  <PostTitle>{post.title}</PostTitle>
                  <PostExcerpt>
                    {post.excerpt || post.content.slice(0, 120) + '...'}
                  </PostExcerpt>
                </CardContent>
                <CardFooter>
                  <Link to={`/posts/${post.id}`}>
                    <Text as="span" variant="label">Learn More →</Text>
                  </Link>
                </CardFooter>
              </PostCard>
            ))}
          </PostsGrid>
        )}
      </PostsSection>
    </Container>
  );
};

/* === Styled Components === */
const Container = styled.main`
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[900]});
  color: white;
  padding: 6rem 2rem;
  text-align: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    text-align: left;
    gap: 3rem;
    padding: 8rem 2rem;
  }
`;

const HeroContent = styled.div`max-width: 600px;`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1.2;
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const HeroSubtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const HeroImage = styled.img`
  width: 100%;
  max-width: 480px;
  height: auto;
  border-radius: ${({ theme }) => theme.radii.lg};
  margin-top: 2rem;

  @media (min-width: 1024px) {
    margin-top: 0;
  }
`;

const PostsSection = styled.section`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  align-items: center;
  justify-items: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PostCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 350px;

  @media (min-width: 340px) {
    width: 200px;
    height: 200px;
  }
  @media (min-width: 768px) {
    width: 280px;
    height: 300px;
  }
  @media (min-width: 1024px) {
    width: 350px;
    height: 350px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem 1.25rem;
  flex: 1;
  overflow: hidden;
`;

const PostTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PostExcerpt = styled.p`
  font-size: 0.9rem;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const CardFooter = styled.div`
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #eee;
`;

const NoPosts = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.gray[700]};
`;
