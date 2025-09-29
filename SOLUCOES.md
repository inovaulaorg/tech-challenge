# 🔧 Soluções Implementadas - Luísa Longo de Lima e Lima

## 📊 Resumo das Correções

- ✅ **N+1 Queries**: Implementado eager loading no postController

## 🚀 Performance - Antes vs Depois

### N+1 Query Problem (postController.ts)

**Antes**: 50 posts = 150+ queries

```javascript
// Código problemático encontrado
// Intentional N+1 query problem: This will cause performance issues
    const posts = await Post.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
        // Missing eager loading for comments and likes - will cause N+1 queries
      ],
    });

    // Intentionally inefficient: Making separate queries for each post
    const postsWithCounts = await Promise.all(
      posts.rows.map(async (post) => {
        const commentCount = await Comment.count({ where: { postId: post.id } });
        const likeCount = await Like.count({ where: { postId: post.id } });
        const isLiked = req.user 
          ? await Like.findOne({ where: { postId: post.id, userId: req.user.id } }) !== null
          : false;

        return {
          ...post.toJSON(),
          commentCount,
          likeCount,
          isLiked,
        };
      })
    );

    res.status(200).json({
      posts: postsWithCounts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(posts.count / limitNumber),
        totalItems: posts.count,
        hasNextPage: pageNumber < Math.ceil(posts.count / limitNumber),
        hasPrevPage: pageNumber > 1,
      },

// Minha solução implementada
    // Intentional N+1 query problem: This will cause performance issues
    const posts = await Post.findAll({
      where: whereClause,
      limit: limitNumber,
      offset,
      order: [[sortBy, sortOrder]],
      subQuery: false,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
          required: false,
        },
        //Eager Loading para contagem de comentários e likes, e se o post foi curtido
        {
          model: Comment,
          as: 'comments',
          attributes: [],
          required: false,
        },
        {
          model: Like,
          as: 'likes',
          attributes: [],
          required: false,
        },
      ],
      //Atributos retornados:
      attributes: [
        'id',
        'title',
        'authorId',
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "comments"."id"')), 'commentCount'],
        [Sequelize.fn('COUNT', Sequelize.literal('DISTINCT "likes"."id"')), 'likeCount'],
        [
          Sequelize.literal(`CASE 
            WHEN EXISTS (
              SELECT 1 
              FROM "Likes" AS l 
              WHERE l."postId" = "Post"."id" 
              AND l."userId" = ${req.user ? req.user.id : 0}
            ) 
            THEN true ELSE false END`),
          'isLiked',
        ],
      ],
      group: [
        'Post.id',
        'author.id',
      ],
    });
  
    //Contagem de posts
    const totalPosts = await Post.count({
      where: whereClause,
    });

// Código problemático encontrado
const post = await Post.findByPk(parseInt(id), {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
        },
      ],
    });

 // Intentional N+1 query problem: Get comments with authors inefficiently
    const commentsWithAuthors = await post.getCommentsWithAuthors();

// Minha solução implementada
const post = await Post.findByPk(parseInt(id), {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
        },
        //Solução para o problema de query N + 1
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
            },
          ],
        },
      ],
    });