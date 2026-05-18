export interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: Date;
  likes: number;
  comments: number;
  image?: string;
  type: 'event' | 'announcement' | 'workout' | 'achievement';
  isLiked?: boolean;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: Date;
  isRead: boolean;
  icon: string;
  link?: string;
}

export interface UserActivity {
  id: number;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: Date;
}