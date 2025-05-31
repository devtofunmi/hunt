'use client';

import React, { useState } from 'react';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string;
  user: {
    id: string;
    username: string;
    image: string;
  };
  replies?: Comment[];
};

type CommentWithRepliesProps = {
  comment: Comment;
  replies: Comment[];
  onReply: (content: string, parentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId: string | null;
};

const UserComment: React.FC<CommentWithRepliesProps> = ({
  comment,
  replies,
  onReply,
  onDelete,
  currentUserId,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    setLoadingReply(true);
    try {
      await onReply(replyContent, comment.id);
      setReplyContent('');
      setReplying(false);
    } catch (error) {
      console.error('Reply submission failed:', error);
    } finally {
      setLoadingReply(false);
    }
  };

  const canDelete = currentUserId === comment.user.id;

  return (
    <div className="mb-4 border-l border-gray-600 pl-4">
      <div className="flex gap-3 items-start">
        <img
          src={comment.user.image}
          alt={comment.user.username}
          className="w-8 h-8 rounded-full border border-gray-600"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold">{comment.user.username}</p>
          <p className="text-sm text-gray-300">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(comment.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <button
              onClick={() => setReplying((r) => !r)}
              className="cursor-pointer hover:underline"
              type="button"
            >
              Reply
            </button>
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="hover:underline cursor-pointer text-red-500"
                type="button"
              >
                Delete
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-2">
              <textarea
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full rounded-md border border-gray-700  px-2 py-1 text-white focus:outline-none"
                placeholder="Write a reply..."
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleReplySubmit}
                  disabled={loadingReply}
                  className="border border-gray-700 text-sm cursor-pointer hover:bg-gray-700 px-4 py-1 rounded-md text-white disabled:opacity-50"
                  type="button"
                >
                  {loadingReply ? 'Sending...' : 'Send'}
                </button>
                <button
                  onClick={() => {
                    setReplying(false);
                    setReplyContent('');
                  }}
                  className="px-3 cursor-pointer py-1 rounded-md text-sm hover:text-red-500 text-white"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {replies.length > 0 && (
            <div className="mt-4 ml-4 border-l border-gray-700 pl-4">
              {replies.map((reply) => (
                <UserComment
                  key={reply.id}
                  comment={reply}
                  replies={reply.replies || []}
                  onReply={onReply}
                  onDelete={onDelete}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserComment;