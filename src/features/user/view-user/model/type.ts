export interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any | null;
}
