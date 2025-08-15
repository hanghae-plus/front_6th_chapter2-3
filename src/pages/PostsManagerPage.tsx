import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui";

import { SearchBar } from "@/widgets/SearchBar";
import { Pagination } from "@/shared/ui/Pagination";
import { PostAddDialog, PostTable } from "@/features/post/ui";
import { usePosts } from "@/features/post/api/usePosts";
import { usePostStore } from "@/entities/post/model/store";

const PostsManager = () => {
  const { posts, total, loading, pagination } = usePosts();
  const { setPagination } = usePostStore();

  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchBar />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable posts={posts} />
          )}

          {/* 페이지네이션 */}
          <Pagination
            limit={pagination.limit}
            setLimit={(limit) => setPagination(pagination.skip, limit)}
            skip={pagination.skip}
            setSkip={(skip) => setPagination(skip, pagination.limit)}
            total={total}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 */}
      <PostAddDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </Card>
  );
};

export default PostsManager;
