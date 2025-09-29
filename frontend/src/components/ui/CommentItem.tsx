import React, { useState } from 'react';
import styled from 'styled-components';
import { Comment as CommentType, CreateCommentRequest } from '../../types';
import { commentService } from '../../services/commentService';
import { Button } from '../ui';
import { CommentInput } from '../forms/CommentInput';

interface CommentItemProps {
  comment: CommentType;
  postId: number;
  currentUserId: number | undefined;
  onCommentUpdate?: (updated: CommentType) => void;
  onCommentDelete?: (id: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  currentUserId,
  onCommentUpdate,
  onCommentDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  const isAuthor = comment.authorId === currentUserId;

  const handleUpdate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await commentService.updateComment(comment.id, content);
      onCommentUpdate?.(res.comment);
      setEditing(false);
    } catch (err) {
      console.error('Erro ao atualizar comentário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await commentService.deleteComment(comment.id);
      onCommentDelete?.(comment.id);
    } catch (err) {
      console.error('Erro ao deletar comentário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setLoading(true);
    try {
      const newComment: CreateCommentRequest = {
        content: replyContent,
        postId: postId,
        parentId: comment.id,
      };
      const res = await commentService.createComment(newComment);
      if (!comment.replies) comment.replies = [];
      comment.replies.unshift(res.comment);
      setReplyContent('');
      setReplying(false);
      onCommentUpdate?.({ ...comment });
    } catch (err) {
      console.error('Erro ao responder comentário:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommentWrapper>
      <CommentHeader>
        <Author>{comment.author?.username || 'Unknown'}</Author>
        <Time>{new Date(comment.createdAt).toLocaleDateString()}</Time>
      </CommentHeader>

      {editing ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <InputEdit
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleUpdate} disabled={loading}>
            Save
          </Button>
          <Button variant="outline" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <CommentContent>{comment.content}</CommentContent>
      )}

      <Actions>
        <Button variant="ghost" size="sm" onClick={() => setReplying(!replying)}>
          Reply
        </Button>
        {isAuthor && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Actions>

      {replying && (
        <ReplyWrapper>
          <CommentInput
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onSubmit={handleReply}
          />
        </ReplyWrapper>
      )}

      {/* Render replies recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <RepliesList>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              onCommentUpdate={(updated) => {
                const index = comment.replies!.findIndex((c) => c.id === updated.id);
                if (index > -1) {
                  comment.replies![index] = updated;
                  onCommentUpdate?.({ ...comment });
                }
              }}
              onCommentDelete={(id) => {
                comment.replies = comment.replies!.filter((c) => c.id !== id);
                onCommentUpdate?.({ ...comment });
              }}
            />
          ))}
        </RepliesList>
      )}
    </CommentWrapper>
  );
};

/* === Styled Components === */
const CommentWrapper = styled.li`
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const Author = styled.span`
  font-weight: 600;
`;

const Time = styled.span``;

const CommentContent = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ReplyWrapper = styled.div`
  margin-top: 0.5rem;
  margin-left: 1.5rem;
`;

const RepliesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1.5rem;
`;

const InputEdit = styled.input`
  flex: 1;
  padding: 0.4rem 0.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
`;
