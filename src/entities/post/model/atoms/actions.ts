import { atom } from 'jotai';

import {
  apiAddPost,
  apiDeletePost,
  apiFetchPosts,
  apiFetchPostsByTag,
  apiFetchTags,
  apiFetchUsersLite,
  apiSearchPosts,
  apiUpdatePost,
} from '../../api';
import type { Comment, Post, Tag, UserLite } from '../types';
import { commentsAtom } from './comments';
import { newCommentAtom, newPostAtom } from './drafts';
import { selectedCommentAtom, selectedPostAtom } from './selection';
import {
  postsAtom,
  totalAtom,
  skipAtom,
  limitAtom,
  searchQueryAtom,
  tagsAtom,
  loadingAtom,
} from './state';
import {
  showAddCommentDialogAtom,
  showAddDialogAtom,
  showEditCommentDialogAtom,
  showEditDialogAtom,
} from './ui';
import { runWithLoading } from '../../../../shared/lib/loading';
import { attachAuthor } from '../../../../shared/lib/posts';
import { replaceById, removeById } from '../../../../shared/lib/array';
import { apiJson } from '../../../../shared/lib/api';
import { INITIAL_NEW_COMMENT, INITIAL_NEW_POST } from '../constants';

export const fetchTagsAtom = atom(null, async (_get, set) => {
  const data = await apiFetchTags();
  set(tagsAtom, data as Tag[]);
});

export const fetchPostsAtom = atom(null, async (get, set) => {
  await runWithLoading(set, loadingAtom, async () => {
    const limit = get(limitAtom);
    const skip = get(skipAtom);
    const postsData = await apiFetchPosts(limit, skip);
    const usersData = await apiFetchUsersLite();
    const users = usersData.users as UserLite[];
    const postsWithUsers = attachAuthor(postsData.posts as Post[], users);
    set(postsAtom, postsWithUsers);
    set(totalAtom, postsData.total as number);
  });
});

export const fetchPostsByTagAtom = atom(null, async (_get, set, tag: string) => {
  if (!tag || tag === 'all') {
    await set(fetchPostsAtom);
    return;
  }
  await runWithLoading(set, loadingAtom, async () => {
    const [postsData, usersData] = await Promise.all([
      apiFetchPostsByTag(tag),
      apiFetchUsersLite(),
    ]);
    const users = usersData.users as UserLite[];
    const postsWithUsers = attachAuthor(postsData.posts as Post[], users);
    set(postsAtom, postsWithUsers);
    set(totalAtom, postsData.total as number);
  });
});

export const searchPostsAtom = atom(null, async (get, set) => {
  const q = get(searchQueryAtom);
  if (!q) {
    await set(fetchPostsAtom);
    return;
  }
  await runWithLoading(set, loadingAtom, async () => {
    const data = await apiSearchPosts(q);
    set(postsAtom, data.posts as Post[]);
    set(totalAtom, data.total as number);
  });
});

export const addPostAtom = atom(null, async (get, set) => {
  const draft = get(newPostAtom);
  const data = await apiAddPost(draft);
  const current = get(postsAtom) as Post[];
  set(postsAtom, [data as Post, ...current]);
  set(showAddDialogAtom, false);
  set(newPostAtom, INITIAL_NEW_POST);
});

export const updatePostAtom = atom(null, async (get, set) => {
  const post = get(selectedPostAtom) as Post;
  const updated = await apiUpdatePost(post.id, post);
  set(postsAtom, replaceById(get(postsAtom) as Post[], updated as Post));
  set(showEditDialogAtom, false);
});

export const deletePostAtom = atom(null, async (get, set, id: number) => {
  await apiDeletePost(id);
  set(postsAtom, removeById(get(postsAtom) as Post[], id));
});

export const fetchCommentsAtom = atom(null, async (get, set, postId: number) => {
  const map = get(commentsAtom) as Record<number, Comment[]>;
  if (map[postId]) return;
  const data = await apiJson<{ comments: Comment[] }>(`/api/comments/post/${postId}`);
  set(commentsAtom, { ...map, [postId]: data.comments });
});

export const addCommentAtom = atom(null, async (get, set) => {
  const draft = get(newCommentAtom);
  const data = await apiJson<Comment>('/api/comments/add', { method: 'POST', body: draft });
  const map = get(commentsAtom) as Record<number, Comment[]>;
  set(commentsAtom, { ...map, [data.postId]: [...(map[data.postId] || []), data] });
  set(showAddCommentDialogAtom, false);
  set(newCommentAtom, INITIAL_NEW_COMMENT);
});

export const updateCommentAtom = atom(null, async (get, set) => {
  const selected = get(selectedCommentAtom)!;
  const data = await apiJson<Comment>(`/api/comments/${selected.id}`, {
    method: 'PUT',
    body: { body: selected.body },
  });
  const postId = data.postId as number;
  const map = get(commentsAtom) as Record<number, Comment[]>;
  set(commentsAtom, {
    ...map,
    [postId]: replaceById(map[postId], data),
  });
  set(showEditCommentDialogAtom, false);
});

export const deleteCommentAtom = atom(null, async (get, set, id: number, postId: number) => {
  await apiJson(`/api/comments/${id}`, { method: 'DELETE' });
  const map = get(commentsAtom) as Record<number, Comment[]>;
  set(commentsAtom, {
    ...map,
    [postId]: removeById(map[postId], id),
  });
});

export const likeCommentAtom = atom(null, async (get, set, id: number, postId: number) => {
  const map = get(commentsAtom) as Record<number, Comment[]>;
  const current = map[postId].find((c) => c.id === id)!;
  const data = await apiJson<Comment>(`/api/comments/${id}`, {
    method: 'PATCH',
    body: { likes: current.likes + 1 },
  });
  set(commentsAtom, {
    ...map,
    [postId]: replaceById(map[postId], { ...data, likes: current.likes + 1 }),
  });
});
