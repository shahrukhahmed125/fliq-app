export interface User {
  id: string | number;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  city?: string;
  website?: string;
  profile_photo?: string | null;
  profile_cover?: string | null;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_verified?: boolean;
  created_at?: string;
}

export interface PostMedia {
  id: string;
  file_path: string;
  file_type: 'image' | 'video';
  width?: number;
  height?: number;
  status?: 'processing' | 'completed' | 'failed';
}

export interface Post {
  id: string;
  uuid?: string;
  user_id?: string | number;
  content: string;
  city?: string;
  topics?: string[];
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  bookmarks_count?: number;
  is_liked: boolean;
  is_reposted: boolean;
  is_bookmarked?: boolean;
  media: PostMedia[];
  user: User;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id?: string;
  parent_id?: string | null;
  content: string;
  user: User;
  created_at: string;
  replies_count?: number;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'repost' | 'follow' | 'mention';
  actor: User;
  post?: Post;
  text?: string;
  created_at: string;
  read: boolean;
}

export interface TrendTopic {
  id: string;
  topic: string;
  postsCount: string;
  category: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  category: string;
  bio: string;
  followersCount: string;
}
