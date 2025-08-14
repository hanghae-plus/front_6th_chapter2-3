import { atom, useAtom } from 'jotai';

import { Post } from '@/entities/post';

import { Nullable } from '../..';

export interface UIState {
  showAddDialog: boolean;
  showEditDialog: boolean;
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;
  showPostDetailDialog: boolean;
  showUserModifyDialog: boolean;
  selectedPost: Nullable<Post>;
  searchQuery: string;
}

const initialUIState: UIState = {
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModifyDialog: false,
  selectedPost: null,
  searchQuery: '',
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

const searchQueryAtom = atom(
  get => get(dialogAtom).searchQuery,
  (get, set, newValue: string) => {
    set(dialogAtom, { ...get(dialogAtom), searchQuery: newValue });
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
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

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
    searchQuery,
    setSearchQuery,
  };
};
