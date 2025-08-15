import { atom } from 'jotai';

import type { Comment, Post, User } from '../types';

export const selectedPostAtom = atom<Post | null>(null);
export const selectedUserAtom = atom<User | null>(null);
export const selectedCommentAtom = atom<Comment | null>(null);
