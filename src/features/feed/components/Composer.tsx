import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Video,
  Hash,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../../context/useAuth';
import { getInitials } from '../../../lib/helpers';
import { postService } from '../../../services/postService';

interface ComposerProps {
  compact?: boolean;
  onPostSuccess?: (post: any) => void;
}

export default function Composer({ compact = false, onPostSuccess }: ComposerProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>(['Pakistan']);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handlePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && images.length === 0) return;

    try {
      setIsLoading(true);
      setShowUploadProgress(true);
      setUploadProgress(25);

      const postData = {
        content: text.trim(),
        topics,
        media: images.map((uri, idx) => ({
          id: `media-${Date.now()}-${idx}`,
          file_type: 'image',
          file_path: uri,
          status: 'completed',
        })),
      };

      setUploadProgress(75);
      const newPost = await postService.createPost(postData, (p) => {
        setUploadProgress(p);
      });

      setShowSuccess(true);
      setShowUploadProgress(false);

      setTimeout(() => {
        setText('');
        setImages([]);
        setTopicInput('');
        setShowSuccess(false);
        setUploadProgress(0);

        if (onPostSuccess) {
          onPostSuccess(newPost);
        }
      }, 500);
    } catch (error) {
      console.error('POST ERROR:', error);
      setShowUploadProgress(false);
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImages((prev) => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTopicAdd = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();

    const cleaned = topicInput.trim().replace(/^#/, '');
    if (cleaned && !topics.includes(cleaned)) {
      setTopics((prev) => [...prev, cleaned]);
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
  };

  return (
    <div className={`p-4 bg-white border-b border-gray-100 ${compact ? 'py-3' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold flex items-center justify-center shrink-0 text-sm shadow-sm">
          {user?.profile_photo ? (
            <img
              src={user.profile_photo}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials(user?.name || 'Fliq')}</span>
          )}
        </div>

        {/* Body */}
        <div className="flex-1">
          {/* Progress Bar */}
          {showUploadProgress && (
            <div className="mb-2">
              <div className="flex justify-between text-xs text-emerald-600 mb-1 font-medium">
                <span>Publishing to Fliq...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Text input */}
          <textarea
            className="w-full text-sm text-gray-800 placeholder-gray-400 border-none outline-none resize-none bg-transparent focus:ring-0 p-0 leading-relaxed min-h-[64px]"
            placeholder="What's on your mind? Share thoughts with Pakistan..."
            rows={compact ? 2 : 3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading || showSuccess}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-xs">
                  <img src={img} alt="attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-all"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Topics tags */}
          {topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  #{topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="hover:text-emerald-900 ml-0.5"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Topic Input Field */}
          {showTopicInput && (
            <div className="flex items-center gap-2 mb-3 max-w-xs">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">#</span>
                <input
                  type="text"
                  placeholder="Add topic (e.g. Cricket)"
                  className="w-full pl-6 pr-3 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={handleTopicAdd}
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleTopicAdd}
                className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-medium hover:bg-emerald-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowTopicInput(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Footer toolbar */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || showSuccess}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-full transition-all"
                title="Add photo"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  // Simulate video selection placeholder
                  setTopics((prev) => prev.includes('Video') ? prev : [...prev, 'Video']);
                }}
                disabled={isLoading || showSuccess}
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/60 rounded-full transition-all"
                title="Add video"
              >
                <Video size={18} />
              </button>
              <button
                type="button"
                onClick={() => setShowTopicInput(!showTopicInput)}
                disabled={isLoading || showSuccess}
                className={`p-2 rounded-full transition-all ${
                  showTopicInput ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/60'
                }`}
                title="Add topic tag"
              >
                <Hash size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handlePost}
              disabled={isLoading || showSuccess || (!text.trim() && images.length === 0)}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all ${
                showSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {showSuccess ? (
                <>
                  <Check size={14} />
                  <span>Posted!</span>
                </>
              ) : isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
