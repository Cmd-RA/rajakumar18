export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  isMonetized: boolean;
  isAdmin: boolean;
};

export type Post = {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  username: string;
  userAvatar: string;
};

export type AppScreen = 'HOME' | 'UPLOAD' | 'PROFILE' | 'DASHBOARD' | 'ADMIN' | 'STATIC_PAGES';
