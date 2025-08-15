import { Table } from "@/base/ui/Table"
import type { Post } from "@/entities/post/model"
import { PostActions, PostReactions, PostTitleSection } from "@/entities/post/ui"
import type { User } from "@/entities/user/model"
import { UserAvatar } from "@/entities/user/ui"

type PostTableProps = {
  posts: (Post & { author?: User })[]
}

export function PostTable({ posts }: PostTableProps) {
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
              <PostTitleSection title={post.title} tags={post.tags} />
            </Table.Cell>
            <Table.Cell>
              <UserAvatar user={post.author} />
            </Table.Cell>
            <Table.Cell>
              <PostReactions reactions={post.reactions} />
            </Table.Cell>
            <Table.Cell>
              <PostActions post={post} />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
