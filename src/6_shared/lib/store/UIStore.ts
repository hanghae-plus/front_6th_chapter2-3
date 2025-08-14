import { atom, useAtom } from 'jotai';

import { Comment } from '@/entities/comment';
import { Post } from '@/entities/post';
import { User } from '@/entities/user';
import { Nullable } from '@/shared/types';

export interface UIState {
  showAddDialog: boolean;
  showEditDialog: boolean;
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;
  showPostDetailDialog: boolean;
  showUserModifyDialog: boolean;
  selectedPost: Nullable<Post>;
  selectedComment: Nullable<Comment>;
  selectedUser: Nullable<User>;
}

const initialUIState: UIState = {
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModifyDialog: false,
  selectedPost: null,
  selectedComment: null,
  selectedUser: null,
};

export const dialogAtom = atom<UIState>(initialUIState);

const showAddDialogAtom = atom(
  get => get(dialogAtom).showAddDialog,
  (get, set, newValue: boolean) => {
    set(dialogAtom, { ...get(dialogAtom), showAddDialog: newValue });
  }
);

const showEditDialogAtom = atom(
  get => get(dialogAtom).showEditDialog,
  (get, set, newValue: boolean) => {
    set(dialogAtom, { ...get(dialogAtom), showEditDialog: newValue });
  }
);

const showAddCommentDialogAtom = atom(
  get => get(dialogAtom).showAddCommentDialog,
  (get, set, newValue: boolean) => {
    set(dialogAtom, { ...get(dialogAtom), showAddCommentDialog: newValue });
  }
);

const showEditCommentDialogAtom = atom(
  get => get(dialogAtom).showEditCommentDialog,
  (get, set, newValue: boolean) => {
    set(dialogAtom, { ...get(dialogAtom), showEditCommentDialog: newValue });
  }
);

const showPostDetailDialogAtom = atom(
  get => get(dialogAtom).showPostDetailDialog,
  (get, set, newValue: boolean) => {
    set(dialogAtom, { ...get(dialogAtom), showPostDetailDialog: newValue });
  }
);

const showUserModalAtom = atom(
  get => get(dialogAtom).showUserModifyDialog,
  (get, set, newValue: boolean) => {
    set(dialogAtom, { ...get(dialogAtom), showUserModifyDialog: newValue });
  }
);

const selectedPostAtom = atom(
  get => get(dialogAtom).selectedPost,
  (get, set, newValue: Nullable<Post>) => {
    set(dialogAtom, { ...get(dialogAtom), selectedPost: newValue });
  }
);

const selectedCommentAtom = atom(
  get => get(dialogAtom).selectedComment,
  (get, set, newValue: Nullable<Comment>) => {
    set(dialogAtom, { ...get(dialogAtom), selectedComment: newValue });
  }
);

const selectedUserAtom = atom(
  get => get(dialogAtom).selectedUser,
  (get, set, newValue: Nullable<User>) => {
    set(dialogAtom, { ...get(dialogAtom), selectedUser: newValue });
  }
);

export const useUIStore = () => {
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom);
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom);
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(
    showAddCommentDialogAtom
  );
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(
    showEditCommentDialogAtom
  );
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(
    showPostDetailDialogAtom
  );
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom);
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);
  const [selectedUser, setSelectedUser] = useAtom(selectedUserAtom);

  return {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
    showPostDetailDialog,
    setShowPostDetailDialog,
    showUserModal,
    setShowUserModal,
    selectedPost,
    setSelectedPost,
    selectedComment,
    setSelectedComment,
    selectedUser,
    setSelectedUser,
  };
};
