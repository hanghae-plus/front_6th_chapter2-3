import { Plus } from "lucide-react"

import { Button } from "@/shared/ui"

import { useAddPostModal } from "../model/useAddPostModal"
import { AddPostModal } from "./AddPostModal"

export const AddPostButton = () => {
  const addPostModal = useAddPostModal()

  return (
    <>
      <Button onClick={() => addPostModal.open()}>
        <Plus className="w-4 h-4 mr-2" />
        게시물 추가
      </Button>
      <AddPostModal />
    </>
  )
}
