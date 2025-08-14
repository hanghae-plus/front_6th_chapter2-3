import type { Comment, CommentsApiResponse } from "../types";

const API_BASE_URL = "/api";

export const fetchCommentsByPostId = async (postId: number): Promise<CommentsApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
};

export const addComment = async (commentData: { body: string; postId: number; userId: number }): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return response.json();
};

export const updateComment = async (commentId: number, commentBody: string): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: commentBody }),
    });
    if (!response.ok) throw new Error("Failed to update comment");
    return response.json();
};

export const deleteComment = async (commentId: number): Promise<{ isDeleted: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete comment");
    return response.json();
};

export const likeComment = async (commentId: number, currentLikes: number): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentLikes + 1 }),
    });
    if (!response.ok) throw new Error("Failed to like comment");
    return response.json();
};
