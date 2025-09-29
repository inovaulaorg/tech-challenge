import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import { Container, Box, Heading, Text, Button, Flex } from '../../components/ui';
import { Post, PaginationMeta } from '../../types';
import { PostCard } from '../../components/post/Card';

export const PostListPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchPosts = async (pageNumber: number) => {
            setLoading(true);
            try {
                const res = await postService.getPosts({ page: pageNumber, limit: 10 });
                setPosts(res.posts);
                setPagination(res.pagination);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts(page);
    }, [page]);

    const handlePrev = () => {
        if (pagination && pagination.hasPrevPage) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        if (pagination && pagination.hasNextPage) {
            setPage(page + 1);
        }
    };

    return (
        <Container maxWidth="700px" mx="auto">
            <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
                <Heading as="h1" textAlign="center" mb={6}>
                    Posts
                </Heading>
                {loading ? (
                    <Text textAlign="center">Carregando...</Text>
                ) : posts.length === 0 ? (
                    <Text textAlign="center">Nenhum post encontrado.</Text>
                ) : (
                    posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
                {pagination && (
                    <>
                        <Text textAlign="center" mt={4}>
                            Página {pagination.currentPage} de {pagination.totalPages} ({pagination.totalItems} posts)
                        </Text>
                        <Flex justifyContent="center" mt={2} style={{ gap: 8 }}>
                            <Button onClick={handlePrev} disabled={!pagination.hasPrevPage || loading}>
                                Página anterior
                            </Button>
                            <Button onClick={handleNext} disabled={!pagination.hasNextPage || loading}>
                                Próxima página
                            </Button>
                        </Flex>
                    </>
                )}
            </Box>
        </Container>
    );
};