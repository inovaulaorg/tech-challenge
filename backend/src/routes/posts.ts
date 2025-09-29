import { Router } from 'express';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost 
} from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, createPostSchema, updatePostSchema } from '../middleware/validation';

const router = Router();

router.get('/', authenticateToken, getPosts);
router.get('/:id', authenticateToken, getPostById);

// Protected routes
router.post('/', authenticateToken, validateRequest(createPostSchema), createPost);
router.put('/:id', authenticateToken, validateRequest(updatePostSchema), updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/like/:id', authenticateToken, likePost);

export default router;