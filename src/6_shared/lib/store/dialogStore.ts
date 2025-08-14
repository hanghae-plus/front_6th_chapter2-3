import { atom, useAtom } from 'jotai';

export interface DialogState {
  showAddDialog: boolean;
  showEditDialog: boolean;
  showAddCommentDialog: boolean;
  showEditCommentDialog: boolean;
  showPostDetailDialog: boolean;
  showUserModifyDialog: boolean;
}

const initialDialogState: DialogState = {
  showAddDialog: false,
  showEditDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showPostDetailDialog: false,
  showUserModifyDialog: false,
};

export const dialogAtom = atom<DialogState>(initialDialogState);

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

export const useDialogStore = () => {
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
  };
};
