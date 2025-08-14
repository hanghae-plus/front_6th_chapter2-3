import { GetCommentsResponseType, PostCommentRequestType, PutCommentRequestType } from '../model';

export const getComments = async (postId: number): Promise<GetCommentsResponseType> => {
  const response = await fetch(`/api/comments/post/${postId}`);
  return response.json();
};

export const postComment = async (comment: PostCommentRequestType) => {
  const response = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  return response.json();
};

export const putComment = async (comment: PutCommentRequestType) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: comment.body }),
  });
  return response.json();
};

export const deleteComment = async (id: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

// export const patchLikeComment = async (id: number) => {

// }