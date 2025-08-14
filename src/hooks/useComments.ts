import { useState, useCallback } from "react";
import {
    fetchCommentsByPostId,
    addComment as apiAddComment,
    updateComment as apiUpdateComment,
    deleteComment as apiDeleteComment,
    likeComment as apiLikeComment,
} from "../api/comments";
import type { Comment } from "../types";

export const useComments = () => {
    const [comments, setComments] = useState<Record<number, Comment[]>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getComments = useCallback(async (postId: number) => {
        if (comments[postId]) return; // Avoid re-fetching
        setLoading(true);
        setError(null);
        try {
            const response = await fetchCommentsByPostId(postId);
            setComments(prev => ({ ...prev, [postId]: response.comments }));
        } catch (e) {
            setError(e as Error);
            console.error(`Failed to fetch comments for post ${postId}:`, e);
        } finally {
            setLoading(false);
        }
    }, [comments]);

    const addComment = async (postId: number, body: string, userId: number) => {
        try {
            const newComment = await apiAddComment({ body, postId, userId });
            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), newComment],
            }));
        } catch (e) {
            console.error("Failed to add comment:", e);
            // Optionally re-throw or handle error in UI
        }
    };

    const updateComment = async (postId: number, commentId: number, body: string) => {
        try {
            const updatedComment = await apiUpdateComment(commentId, body);
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].map(c => (c.id === commentId ? updatedComment : c)),
            }));
        } catch (e) {
            console.error("Failed to update comment:", e);
        }
    };

    const deleteComment = async (postId: number, commentId: number) => {
        try {
            await apiDeleteComment(commentId);
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].filter(c => c.id !== commentId),
            }));
        } catch (e) {
            console.error("Failed to delete comment:", e);
        }
    };

    const likeComment = async (postId: number, commentId: number) => {
        try {
            const commentToLike = comments[postId].find(c => c.id === commentId);
            if (!commentToLike) return;

            const updatedComment = await apiLikeComment(commentId, commentToLike.likes);
            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].map(c => (c.id === commentId ? { ...updatedComment, likes: c.likes + 1 } : c)),
            }));
        } catch (e) {
            console.error("Failed to like comment:", e);
        }
    };


    return {
        comments,
        loading,
        error,
        getComments,
        addComment,
        updateComment,
        deleteComment,
        likeComment,
    };
};
