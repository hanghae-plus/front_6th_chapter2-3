import { PostWithAuthor } from "@/entities/postsManager/PostsManagerPage"
import { Button, HighlightText, Table, useQueryParams } from "@/shared"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"

interface PostsTableProps {
  openPostDetail: (post: PostWithAuthor) => void
  openUserModal: (userId: number) => void
  posts: PostWithAuthor[]
  setPosts: React.Dispatch<React.SetStateAction<PostWithAuthor[]>>
  openEditDialog: (post: PostWithAuthor) => void
}

export const PostsTable = ({ openPostDetail, openUserModal, openEditDialog, posts, setPosts }: PostsTableProps) => {
  const { searchQuery, updateURL, setSelectedTag, selectedTag } = useQueryParams()

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head className="w-[50px]">ID</Table.Head>
          <Table.Head>제목</Table.Head>
          <Table.Head className="w-[150px]">작성자</Table.Head>
          <Table.Head className="w-[150px]">반응</Table.Head>
          <Table.Head className="w-[150px]">작업</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {posts.map((post) => (
          <Table.Row key={post.id}>
            <Table.Cell>{post.id}</Table.Cell>
            <Table.Cell>
              <div className="space-y-1">
                <div>
                  <HighlightText text={post.title || ""} highlight={searchQuery} />
                </div>

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
                        updateURL({ selectedTag: tag })
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              {post.author && (
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => post.author && openUserModal(post.author.id)}
                >
                  <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author.username}</span>
                </div>
              )}
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions.dislikes || 0}</span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => openPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
