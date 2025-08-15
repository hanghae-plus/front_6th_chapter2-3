// eslint-disable-next-line fsd/no-relative-imports
import { useUserModalStore } from '../../../features/users/model/store';
import { PostAuthor } from '@/entities/posts';
import { Table } from '@/shared/ui/table';

interface UserTriggerProps {
  author?: PostAuthor;
}

const PostUserTrigger = ({ author }: UserTriggerProps) => {
  const { openUserModal } = useUserModalStore();
  return (
    <Table.Cell>
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => openUserModal(author)}
      >
        <img
          src={author?.image}
          alt={author?.username}
          className="w-8 h-8 rounded-full"
        />
        <span>{author?.username}</span>
      </div>
    </Table.Cell>
  );
};

export default PostUserTrigger;
