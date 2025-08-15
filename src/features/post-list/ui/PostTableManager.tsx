import React from 'react';

import { Post, PostTable } from '../../../entities/post';
import { UserAvatarManager } from '../../user-profile';
import { usePostCrud, usePostDialogs } from '../../post-crud';
import { usePostFilter } from '../../post-filter';
import { usePostSearch } from '../../post-search';
import { usePostList } from '../model';

interface PostTableManagerProps {
  onOpenPostDetail: (post: Post) => void;
}

const PostTableManager: React.FC<PostTableManagerProps> = ({
  onOpenPostDetail,
}) => {
  const { posts, removePostFromList } = usePostList();
  const { deletePost } = usePostCrud();
  const { openEditDialog } = usePostDialogs();
  const { searchQuery } = usePostSearch();
  const { selectedTag, setSelectedTag } = usePostFilter();

  const handleEditPost = (post: Post) => {
    console.log('handleEditPost called with:', post);
    openEditDialog(post);
  };

  const handleDeletePost = async (id: number) => {
    if (window.confirm('이 게시물을 삭제하시겠습니까?')) {
      try {
        await deletePost(id);
        removePostFromList(id);
      } catch (error) {
        console.error('삭제 오류:', error);
      }
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const renderUserAvatar = (user: any) => (
    <UserAvatarManager user={user} size='md' />
  );

  return (
    <PostTable
      posts={posts}
      searchQuery={searchQuery}
      selectedTag={selectedTag}
      onOpenPostDetail={onOpenPostDetail}
      onEditPost={handleEditPost}
      onDeletePost={handleDeletePost}
      onTagClick={handleTagClick}
      renderUserAvatar={renderUserAvatar}
    />
  );
};

export default PostTableManager;