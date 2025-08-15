import { Post } from "@entities/post/types"
import { EditPostDialog } from "@features/post/components/EditPostDialog"
import { Button } from "@shared/components/button"
import { Edit2 } from "lucide-react"
import { useState } from "react"

interface EditPostButtonProps {
  post: Post
}

export const EditPostButton = ({ post }: EditPostButtonProps) => {
  const [selectedPost, setSelectedPost] = useState<Post>(post)
  const [open, setOpen] = useState(false)

  const handleShowEditPostDialog = () => {
    setSelectedPost(post)
    setOpen(true)
  }

  const handleChangePost = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setSelectedPost((prev) => {
      return { ...prev, [name]: value }
    })
  }
  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleShowEditPostDialog}>
        <Edit2 className="w-4 h-4" />
      </Button>
      <EditPostDialog
        open={open}
        onOpenChange={setOpen}
        selectedPost={selectedPost}
        handleChangePost={handleChangePost}
      />
    </>
  )
}
