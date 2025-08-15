import { atom } from 'jotai';

import type { NewComment, NewPost } from '../types';
import { INITIAL_NEW_COMMENT, INITIAL_NEW_POST } from '../constants';

export const newPostAtom = atom<NewPost>(INITIAL_NEW_POST);
export const newCommentAtom = atom<NewComment>(INITIAL_NEW_COMMENT);
