import { Router } from 'express';
import { 
  getComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, createCommentSchema, updateCommentSchema } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/post/:postId', authenticateToken, getComments);

// Protected routes
router.post('/', authenticateToken, validateRequest(createCommentSchema), createComment);
router.put('/:id', authenticateToken, validateRequest(updateCommentSchema), updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;