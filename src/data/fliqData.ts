import {
  Bell,
  Bookmark,
  Compass,
  Home,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';

export const posts = [
  {
    name: 'Fliq Studio',
    handle: '@fliq',
    time: '2m',
    city: 'Pakistan',
    text: 'Fliq is being shaped as a calmer public square for Pakistan: fast enough for live trends, thoughtful enough for creators, and simple enough to use every day.',
    replies: 16,
    reposts: 48,
    likes: 520,
    accent: 'emerald',
  },
  {
    name: 'Ayesha Khan',
    handle: '@ayeshawrites',
    time: '4m',
    city: 'Lahore',
    text: 'A calmer social app for Pakistan should reward useful conversation, not outrage. Imagine trends that help you understand the country without making the feed feel exhausting.',
    replies: 42,
    reposts: 128,
    likes: '2.4K',
    accent: 'emerald',
  },
  {
    name: 'Hassan Ali',
    handle: '@hassanbuilds',
    time: '18m',
    city: 'Karachi',
    text: 'Building in public from Pakistan needs better communities: founders, designers, developers, creators, students. Fliq channels could become that daily space.',
    replies: 18,
    reposts: 64,
    likes: 890,
    accent: 'emerald',
  },
  {
    name: 'Cricket Desk',
    handle: '@cricketdesk',
    time: '31m',
    city: 'Islamabad',
    text: 'Match thread is live. Keep it sharp, keep it fun, and please remember: every dropped catch does not need a national inquiry.',
    replies: 305,
    reposts: 710,
    likes: '9.8K',
    accent: 'mint',
  },
];

export const trends = [
  ['Cricket', '92.4K posts'],
  ['Tech Trends', '18.8K posts'],
  ['Design', '12.1K posts'],
  ['Development', '8.6K posts'],
];

export const creators = [
  ['Zara Noor', '@zaracreates', 'Design'],
  ['Bilal Ahmed', '@bilaldev', 'Tech'],
  ['Mina Tariq', '@minatalks', 'Culture'],
];

export const profilePosts = posts.filter((post) => post.handle === '@fliq');

export const profileHighlights = [
  ['12.8K', 'followers'],
  ['186', 'following'],
  ['42', 'posts'],
];

export const navItems = [
  [Home, 'Home', true],
  [Compass, 'Explore'],
  [Bell, 'Notifications'],
  [MessageSquare, 'Messages'],
  [Bookmark, 'Bookmarks'],
  [Settings, 'Settings'],
];
