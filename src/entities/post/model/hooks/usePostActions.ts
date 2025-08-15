import { useSetAtom } from 'jotai';

import {
  fetchTagsAtom,
  fetchPostsAtom,
  fetchPostsByTagAtom,
  searchPostsAtom,
  addPostAtom,
  updatePostAtom,
  deletePostAtom,
} from '../atoms/index';

export function usePostActions() {
  const fetchTags = useSetAtom(fetchTagsAtom);
  const fetchPosts = useSetAtom(fetchPostsAtom);
  const fetchPostsByTag = useSetAtom(fetchPostsByTagAtom);
  const searchPosts = useSetAtom(searchPostsAtom);
  const addPost = useSetAtom(addPostAtom);
  const updatePost = useSetAtom(updatePostAtom);
  const deletePost = useSetAtom(deletePostAtom);

  return { fetchTags, fetchPosts, fetchPostsByTag, searchPosts, addPost, updatePost, deletePost };
}
