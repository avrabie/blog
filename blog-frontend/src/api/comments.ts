import { apiClient } from './client';
import { Comment, NewCommentRequest } from '../types';

export const getCommentsByPostSlug = async (slug: string): Promise<Comment[]> => {
  const response = await apiClient.get<Comment[]>(`/posts/${slug}/comments`);
  return response.data;
};

export const addComment = async (slug: string, comment: NewCommentRequest): Promise<Comment> => {
  const response = await apiClient.post<Comment>(`/posts/${slug}/comments`, comment);
  return response.data;
};

export const addReply = async (commentId: string, reply: NewCommentRequest): Promise<Comment> => {
  const response = await apiClient.post<Comment>(`/comments/${commentId}/replies`, reply);
  return response.data;
};

export const updateComment = async (slug: string, id: string, comment: Partial<NewCommentRequest>): Promise<Comment> => {
  const response = await apiClient.put<Comment>(`/posts/${slug}/comments/${id}`, comment);
  return response.data;
};

export const deleteComment = async (slug: string, id: string): Promise<void> => {
  await apiClient.delete(`/posts/${slug}/comments/${id}`);
};
