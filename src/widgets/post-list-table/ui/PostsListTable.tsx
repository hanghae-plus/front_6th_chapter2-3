import React from "react"
import { useAtom } from "jotai"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { selectedTagAtom } from "../../../store/postsAtoms"
import { usePostSearch } from "../../../features/post/model/usePostSearch"
import { usePostDialogs } from "../../../features/post/model/usePostDialogs"
import { usePosts } from "../../../features/post/model/usePosts"
import { OpenEditPost } from "../../../features/post/ui/OpenEditPost"
import { OpenDetailPost } from "../../../features/post/ui/OpenDetailPost"
import { RemovePostIcon } from "../../../features/post/ui/RemovePostIcon"
import { filterPosts } from "../lib/post"
import { highlightTextParts } from "../../../lib/textHighlight"

export const PostsListTable: React.FC = () => {
  const { posts, loading } = usePosts()
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const { searchQuery } = usePostSearch()

  const { openUserModal } = usePostDialogs()

  // 로딩 중이면 로딩 메시지 표시
  if (loading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  // 게시물이 없으면 메시지 표시
  if (!posts || posts.length === 0) {
    return <div className="text-gray-500 p-4">표시할 게시물이 없습니다.</div>
  }

  // 검색어와 태그에 따른 필터링
  const filteredPosts = filterPosts(posts, searchQuery, selectedTag)

  // 검색어 하이라이트 함수
  const highlightText = (text: string, query: string) => {
    const parts = highlightTextParts(text, query)
    return parts.map((part, index) =>
      part.isHighlight ? (
        <mark key={index} className="bg-yellow-200 font-semibold">
          {part.text}
        </mark>
      ) : (
        part.text
      ),
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px]">작성자</TableHead>
            <TableHead className="w-[150px]">반응</TableHead>
            <TableHead className="w-[150px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{highlightText(post.title, searchQuery)}</div>

                  <div className="flex flex-wrap gap-1">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                          selectedTag === tag
                            ? "text-white bg-blue-500 hover:bg-blue-600"
                            : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                        }`}
                        onClick={() => {
                          setSelectedTag(tag)
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => post.author && openUserModal(post.author)}
                >
                  <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author?.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.reactions?.likes || 0}</span>
                  <ThumbsDown className="w-4 h-4" />
                  <span>{post.reactions?.dislikes || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <OpenDetailPost post={post} />
                <OpenEditPost post={post} />
                <RemovePostIcon postId={post.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
