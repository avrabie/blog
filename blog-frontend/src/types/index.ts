export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  readingTime?: number;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: number;
  parentId?: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface NewPostRequest {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  tags: string[];
}

export interface NewCommentRequest {
  author: string;
  content: string;
}
