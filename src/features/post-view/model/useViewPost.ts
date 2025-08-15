import { useViewPostStore } from './viewPostStore';

export const useViewPost = () => {
  const { isDialogOpen, postToView, openDialog, closeDialog } = useViewPostStore();

  return {
    isDialogOpen,
    postToView,
    openDialog,
    closeDialog,
  };
};
