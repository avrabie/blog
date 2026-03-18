import { apiClient } from './client';
import { Post, NewPostRequest } from '../types';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts');
  return response.data;
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${slug}`);
  return response.data;
};

export const createPost = async (post: NewPostRequest): Promise<Post> => {
  const response = await apiClient.post<Post>('/posts', post);
  return response.data;
};

export const updatePost = async (slug: string, post: Partial<NewPostRequest>): Promise<Post> => {
  const response = await apiClient.put<Post>(`/posts/${slug}`, post);
  return response.data;
};

export const deletePost = async (slug: string): Promise<void> => {
  await apiClient.delete(`/posts/${slug}`);
};
