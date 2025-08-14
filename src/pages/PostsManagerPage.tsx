import { useEffect, useState } from "react"
import { ThumbsDown, ThumbsUp } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { AddPostDialog } from "@/features/post/ui/AddPostDialog"
import { AddPostDialogOpenButton } from "@/features/post/ui/AddPostDialogOpenButton"
import { DeletePostButton } from "@/features/post/ui/DeletePostButton"
import { EditPostDialogOpenButton } from "@/features/post/ui/EditPostDialogOpenButton"
import { EditPostDialog } from "@/features/post/ui/EditPostDialog"
import { DetailPostDialogOpenButton } from "@/features/post/ui/DetailPostDialogOpenButton"
import { DetailPostDialog } from "@/features/post/ui/DetailPostDialog"
import { SortSelectBox } from "@/features/post/ui/SortSelectBox"
import { TagSelectBox } from "@/features/post/ui/TagSelectBox"
import { SearchPostInput } from "@/features/post/ui/SearchPostInput"
import { usePostWithAuthor } from "@/features/post/model/usePostWithAuthor"
import { Comment, PostWithAuthor } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui"

/**
 * 게시물 관리자 컴포넌트
 * 게시물의 CRUD 작업, 댓글 관리 등을 담당
 */
const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // ===== 상태 관리 =====
  // 게시물 관련 상태
  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0")) // 페이지네이션 시작 인덱스
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10")) // 페이지당 게시물 수

  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "") // 검색어
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "") // 정렬 기준
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc") // 정렬 순서
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "") // 선택된 태그

  // 선택된 항목 상태
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor>({
    author: {
      id: 0,
      username: "",
      image: "",
    },
    id: 0,
    title: "",
    body: "",
    userId: 0,
    tags: [],
    reactions: { likes: 0, dislikes: 0 },
    views: 0,
  }) // 선택된 게시물

  // 데이터 상태
  const [comments, setComments] = useState<Record<number, Comment[]>>({}) // 댓글 목록 (게시물 ID별로 그룹화)

  // 게시물 목록 조회 (with author) - 태그별 필터링
  const postsQuery = usePostWithAuthor()

  const posts = postsQuery.posts || []

  // 태그 목록은 TagSelectBox에서 자동으로 처리됨

  // ===== URL 업데이트 함수 =====
  /**
   * 현재 상태를 URL 쿼리 파라미터로 업데이트
   * 페이지 새로고침 시에도 상태 유지
   */
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  // ===== 게시물 관련 함수들 =====
  // fetchPostsByTag 함수 제거 - postWithAuthorQueries.listByTag가 자동으로 처리

  // ===== 댓글 관련 함수들 =====
  /**
   * 특정 게시물의 댓글을 가져오는 함수
   * 이미 불러온 댓글이 있으면 다시 불러오지 않음
   * 클릭했을 때 모달안에서 들고옴.
   * @param postId - 게시물 ID
   */
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const { comments } = await HttpClient.get<{ comments: Comment[] }>(`/comments/post/${postId}`)
      console.log("---comments---")
      console.log(comments)
      setComments((prev) => ({ ...prev, [postId]: comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 좋아요 기능은 현재 사용되지 않음

  // ===== UI 관련 함수들 =====
  /**
   * 게시물 상세 보기 대화상자를 여는 함수
   * @param post - 상세 보기할 게시물
   */
  const openPostDetail = (post: PostWithAuthor) => {
    setSelectedPost(post)
    fetchComments(post.id) // 댓글도 함께 가져옴
  }

  // ===== useEffect 훅들 =====
  // 태그 목록은 TagSelectBox에서 자동으로 처리됨

  // 페이지네이션, 정렬, 태그 변경 시 게시물 다시 가져오기
  // useEffect(() => {
  //   // postsQuery.posts는 게시물 목록 배열
  //   if (postsQuery.posts) {
  //     // author가 undefined인 경우를 필터링하여 PostWithAuthor[] 타입 보장
  //     const validPosts = postsQuery.posts.filter((post) => post.author) as PostWithAuthor[]
  //     setPosts(validPosts)
  //   }
  // }, [postsQuery.posts])

  // URL 쿼리 파라미터 변경 시 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  // ===== 유틸리티 함수들 =====
  /**
   * 텍스트에서 검색어를 하이라이트하는 함수
   * @param text - 원본 텍스트
   * @param highlight - 하이라이트할 검색어
   * @returns 하이라이트된 JSX 요소
   */
  const highlightText = (text: string, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // ===== 렌더링 함수들 =====
  /**
   * 게시물 테이블을 렌더링하는 함수
   * 게시물 목록을 테이블 형태로 표시
   */
  const renderPostTable = () => (
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
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                {/* 제목에 검색어 하이라이트 적용 */}
                <div>{highlightText(post.title, searchQuery)}</div>

                {/* 태그 목록 표시 */}
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
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            {/* 작성자 정보 */}
            <TableCell>
              <div className="flex items-center space-x-2">
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            {/* 게시물 반응 (좋아요/싫어요) 표시 */}
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            {/* 게시물 작업 버튼들 */}
            <TableCell>
              <div className="flex items-center gap-2">
                <DetailPostDialogOpenButton onClick={() => openPostDetail(post)} />
                <EditPostDialogOpenButton onClick={() => openPostDetail(post)} />
                <DeletePostButton post={post} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // ===== 메인 렌더링 =====
  return (
    <Card className="w-full max-w-6xl mx-auto">
      {/* 카드 헤더 - 제목과 게시물 추가 버튼 */}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostDialogOpenButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            {/* 검색 입력창 */}
            <div className="flex-1">
              <SearchPostInput />
            </div>
            {/* 태그 선택 드롭다운 */}
            <TagSelectBox
              selectedTag={selectedTag}
              onTagChange={(value) => {
                setSelectedTag(value)
                updateURL()
              }}
            />
            <SortSelectBox />
          </div>

          {renderPostTable()}
        </div>
      </CardContent>

      <AddPostDialog />
      <EditPostDialog selectedPost={selectedPost} />
      <DetailPostDialog selectedPost={selectedPost} />
    </Card>
  )
}

export default PostsManager
