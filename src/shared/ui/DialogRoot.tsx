import { Dialog } from './components';
import { useDialogStore } from '../hook/useDialogStore';

export const DialogRoot = () => {
  const show = useDialogStore((state) => state.show);
  const setShow = useDialogStore((state) => state.setShow);
  const content = useDialogStore((state) => state.content);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {content}
    </Dialog>
  );
};
