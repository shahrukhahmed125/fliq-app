import React, { useState } from 'react';
import { Loader2, Send, X } from 'lucide-react';
import { postService } from '../../../services/postService';

interface CommentFormProps {
  postUuid: string;
  replyTo?: any;
  onCancelReply: () => void;
  onCommentAdded: (comment: any) => void;
}

export default function CommentForm({
  postUuid,
  replyTo,
  onCancelReply,
  onCommentAdded,
}: CommentFormProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const commentData: any = {
        content: text.trim(),
      };

      if (replyTo) {
        commentData.parent_id = replyTo.id;
      }

      const response = await postService.createComment(postUuid, commentData);
      setText('');
      onCancelReply();
      onCommentAdded(response);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {replyTo && (
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2 bg-emerald-50/60 px-3 py-1.5 rounded-lg border border-emerald-100">
          <span>
            Replying to <strong className="text-emerald-700 font-medium">{replyTo?.user?.name || replyTo?.user?.username}</strong>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-600 p-0.5"
            title="Cancel reply"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          title="Send comment"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
}
