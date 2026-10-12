import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Check,
} from 'lucide-react';
import { formatDate, getInitials } from '../../../lib/helpers';
import { postService } from '../../../services/postService';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface PostCardProps {
  post: any;
  onPostUpdated?: (updated: any) => void;
}

export default function PostCard({ post, onPostUpdated }: PostCardProps) {
  const [isLiked, setIsLiked] = useState<boolean>(post?.is_liked || false);
  const [likesCount, setLikesCount] = useState<number>(
    typeof post?.likes_count === 'number'
      ? post.likes_count
      : typeof post?.likes === 'number'
      ? post.likes
      : 0
  );
  const [repostsCount, setRepostsCount] = useState<number>(post?.reposts_count || post?.reposts || 0);
  const [isReposted, setIsReposted] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsCount, setCommentsCount] = useState<number>(
    post?.comments_count || post?.replies || 0
  );
  const [replyTo, setReplyTo] = useState<any>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      const res = await postService.toggleLike(post.uuid || post.id);
      if (res) {
        setIsLiked(res.is_liked !== undefined ? res.is_liked : !isLiked);
        setLikesCount(res.likes_count !== undefined ? res.likes_count : (isLiked ? likesCount - 1 : likesCount + 1));
      }
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostsCount((prev) => (isReposted ? Math.max(0, prev - 1) : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `#post-${post.id || post.uuid}`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleCommentAdded = (newComment: any) => {
    setCommentsCount((prev) => prev + 1);
  };

  const authorName = post?.user?.name || post?.name || 'Fliq User';
  const authorHandle = post?.user?.username || post?.handle || '@fliq';
  const authorPhoto = post?.user?.profile_photo || null;
  const createdAt = post?.created_at || new Date();
  const mediaList = post?.media || [];
  const topics = post?.topics || [];

  return (
    <article className="p-4 bg-white hover:bg-gray-50/50 transition-colors border-b border-gray-100">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center shrink-0 text-sm shadow-xs">
          {authorPhoto ? (
            <img
              src={authorPhoto}
              alt={authorName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials(authorName)}</span>
          )}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">
                {authorName}
              </span>
              <span className="text-xs text-gray-500 font-normal">
                {authorHandle}
              </span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-500 font-normal">
                {formatDate(createdAt)}
              </span>
              {post.city && (
                <span className="inline-block px-1.5 py-0.2 text-[10px] bg-gray-100 text-gray-600 rounded-md">
                  {post.city}
                </span>
              )}
            </div>
          </div>

          {/* Text Body */}
          <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line mb-2.5">
            {post.content || post.text}
          </p>

          {/* Topics */}
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {topics.map((t: string) => (
                <span
                  key={t}
                  className="text-xs text-emerald-600 font-medium hover:underline cursor-pointer"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Media Images */}
          {mediaList.length > 0 && (
            <div className="mb-3 rounded-xl overflow-hidden border border-gray-100 max-h-96">
              {mediaList.map((m: any, idx: number) => (
                <img
                  key={m.id || idx}
                  src={m.file_path || m.url}
                  alt="Post media"
                  className="w-full object-cover max-h-96"
                />
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between max-w-md pt-1 text-gray-500 text-xs">
            {/* Comment button */}
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 p-1.5 -ml-1.5 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all ${
                showComments ? 'text-emerald-600 font-medium' : ''
              }`}
              title="Replies"
            >
              <MessageCircle size={17} />
              <span>{commentsCount}</span>
            </button>

            {/* Repost button */}
            <button
              type="button"
              onClick={handleRepost}
              className={`flex items-center gap-1.5 p-1.5 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all ${
                isReposted ? 'text-emerald-600 font-medium' : ''
              }`}
              title="Repost"
            >
              <Repeat2 size={17} />
              <span>{repostsCount}</span>
            </button>

            {/* Like button */}
            <button
              type="button"
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all ${
                isLiked ? 'text-red-500 font-medium' : ''
              }`}
              title="Like"
            >
              <Heart
                size={17}
                className={isLiked ? 'fill-red-500 text-red-500' : ''}
              />
              <span>{likesCount}</span>
            </button>

            {/* Share button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 p-1.5 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-all relative"
              title="Share"
            >
              {copiedToast ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-emerald-600 text-[11px]">Copied!</span>
                </>
              ) : (
                <Share2 size={17} />
              )}
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-2">
              <CommentList
                postUuid={post.uuid || post.id}
                isOpen={showComments}
                onReply={(c) => setReplyTo(c)}
              />
              <CommentForm
                postUuid={post.uuid || post.id}
                replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
