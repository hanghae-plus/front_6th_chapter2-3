import { useAtom } from 'jotai';

import {
  selectedPostAtom,
  selectedCommentAtom,
  selectedUserAtom,
  newPostAtom,
  newCommentAtom,
  commentsAtom,
} from '../atoms/index';

export function useSelectionState() {
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);
  const [newPost, setNewPost] = useAtom(newPostAtom);
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const [comments] = useAtom(commentsAtom);

  return {
    selectedPost,
    setSelectedPost,
    selectedComment,
    setSelectedComment,
    selectedUser,
    setSelectedUser,
    newPost,
    setNewPost,
    newComment,
    setNewComment,
    comments,
  };
}
