import { Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import { Post, User, Comment, Like } from '../models';
import { AuthenticatedRequest, CreatePostRequest, UpdatePostRequest, PostQuery } from '../types';

export const getPosts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      tags,
      authorId,
    }: PostQuery = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    // whitelist para os parâmetros de ordenação para prevenir SQL Injection
    const allowedSortBy = ['createdAt', 'title', 'viewCount'];
    const allowedSortOrder = ['ASC', 'DESC'];
    const finalSortBy = allowedSortBy.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = allowedSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const whereClause: any = { isPublished: true };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (tags) {
      whereClause.tags = { [Op.overlap]: tags.split(',').map(tag => tag.trim()) };
    }
    if (authorId) {
      whereClause.authorId = parseInt(authorId);
    }
    
    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset,
      order: [[finalSortBy, finalSortOrder]],
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      ],
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'), 'commentCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")'), 'likeCount'],
        ],
      },
    });

    const postIds = posts.map(post => post.id);
    const userLikes = req.user
      ? await Like.findAll({ where: { userId: req.user.id, postId: postIds } })
      : [];
    const likedPostIds = new Set(userLikes.map(like => like.postId));

    const postsWithLikeStatus = posts.map(post => {
      const postData = post.get({ plain: true }) as Post & { commentCount: string; likeCount: string };
      return {
        ...postData,
        commentCount: parseInt(postData.commentCount, 10),
        likeCount: parseInt(postData.likeCount, 10),
        isLiked: likedPostIds.has(post.id),
      };
    });

    res.status(200).json({
      posts: postsWithLikeStatus,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// (as outras funções do controlador como getPostById, createPost, etc., permanecem as mesmas aqui)
//a lógica de validação foi movida para o middleware, que é a prática recomendada.

export const getPostById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(parseInt(id), {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'avatar'],
            },
          ],
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['userId'],
        },
      ],
      order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'ASC']],
    });

    if (!post || !post.isPublished) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    post.increment('viewCount');
    
    const typedPost = post as Post & { likes: Like[]; comments: (Comment & { author: User })[] };
    const likeCount = typedPost.likes?.length || 0;
    const isLiked = req.user 
      ? typedPost.likes?.some((like: Like) => like.userId === req.user?.id) 
      : false;

    const postJSON = typedPost.toJSON();
    delete (postJSON as any).likes;

    res.status(200).json({
      post: { ...postJSON, likeCount, isLiked },
    });
  } catch (error) {
    console.error('Get post by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    // Os dados do body já foram validados pelo middleware
    const { title, content, excerpt, imageUrl, tags }: CreatePostRequest = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      imageUrl,
      tags: tags || [],
      authorId: userId,
      isPublished: true,
      publishedAt: new Date(),
    });

    const createdPost = await Post.findByPk(post.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: createdPost,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { title, content, excerpt, imageUrl, tags }: UpdatePostRequest = req.body;

    const post = await Post.findByPk(parseInt(id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Not authorized to update this post' });
      return;
    }

    await post.update({ title, content, excerpt, imageUrl, tags });

    const updatedPost = await Post.findByPk(post.id, {
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const post = await Post.findByPk(parseInt(id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this post' });
      return;
    }

    await post.destroy();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const postId = parseInt(req.params.id);

    const like = await Like.findOne({ where: { postId, userId } });

    if (like) {
      await like.destroy();
      res.status(200).json({ message: 'Post unliked', liked: false });
    } else {
      await Like.create({ postId, userId });
      res.status(200).json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

