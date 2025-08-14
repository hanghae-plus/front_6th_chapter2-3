import React from "react"
import { PostManagement } from "../features/posts/ui/PostManagement"
import { ModalManager } from "../features/posts/ui/ModalManager"
import { useAddPost } from "../features/posts/hooks"

const PostsManager = () => {
  const addPost = useAddPost()

  return (
    <>
      <PostManagement onAddPost={() => addPost.modal.open()} />
      <ModalManager />
    </>
  )
}

export default PostsManager
