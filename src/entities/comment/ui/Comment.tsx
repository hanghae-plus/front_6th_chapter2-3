import { CommentType } from "../model/types";

interface CommentProps {
  comment: CommentType;
  highlightText: (text: string, query: string) => React.ReactNode;
  searchQuery: string;
}

export const Comment = ({
  comment,
  highlightText,
  searchQuery,
}: CommentProps) => {
  return (
    <div className="flex items-center space-x-2 overflow-hidden">
      <span className="font-medium truncate">{comment.user.username}:</span>
      <span className="truncate">
        {highlightText(comment.body, searchQuery)}
      </span>
    </div>
  );
};
