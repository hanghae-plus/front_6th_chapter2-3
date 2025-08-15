export interface DialogState {
  dialogs: Record<string, boolean>;
  openDialog: (key: string) => void;
  closeDialog: (key: string) => void;
  isDialogOpen: (key: string) => boolean;
  toggleDialog: (key: string) => void;
}
