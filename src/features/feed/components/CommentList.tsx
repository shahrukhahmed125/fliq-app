import React, { useEffect, useState } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { formatDate, getInitials } from '../../../lib/helpers';
import { postService } from '../../../services/postService';

interface CommentListProps {
  postUuid: string;
  isOpen: boolean;
  onCommentCountChange?: (count: number) => void;
  onReply: (comment: any) => void;
}

export default function CommentList({
  postUuid,
  isOpen,
  onCommentCountChange,
  onReply,
}: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await postService.getComments(postUuid);
      const list = Array.isArray(data) ? data : [];
      setComments(list);
      if (onCommentCountChange) {
        onCommentCountChange(list.length);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postUuid]);

  if (!isOpen) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {loading ? (
        <div className="flex items-center justify-center py-4 text-xs text-gray-500 gap-2">
          <Loader2 size={16} className="animate-spin text-emerald-600" />
          <span>Loading discussions...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-xs text-gray-400 flex flex-col items-center gap-1">
          <MessageSquare size={16} className="opacity-40" />
          <span>No comments yet. Start the conversation!</span>
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {comments.map((comment, index) => (
            <div key={comment.id || index} className="flex gap-2.5 text-xs text-gray-700">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-[11px] shrink-0">
                {getInitials(comment?.user?.name || comment?.user?.username || 'User')}
              </div>
              <div className="flex-1 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">
                    {comment?.user?.name || 'Community Member'}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatDate(comment?.created_at || new Date())}
                  </span>
                </div>
                <p className="text-gray-800 leading-relaxed text-xs">{comment?.content}</p>
                <div className="mt-1.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onReply(comment)}
                    className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
