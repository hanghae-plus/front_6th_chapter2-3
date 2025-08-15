import type { NewPost, NewComment } from './types';

export const INITIAL_NEW_POST: NewPost = { title: '', body: '', userId: 1 };
export const INITIAL_NEW_COMMENT: NewComment = { body: '', postId: null, userId: 1 };
