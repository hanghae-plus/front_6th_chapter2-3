import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import React from "react"

interface PostFormProps {
  open: boolean
  isNewPost: boolean
  onChangeOpen: (open: boolean) => void
  // 게시물 추가 or 게시물 수정
  formTitle: string
  userIdValue?: number
  titleValue: string
  contentValue: string
  onChangeTitle: (value: string) => void
  onChangeContent: (value: string) => void
  onChangeUserId?: (value: number) => void
  //게시물 추가 or 게시물 업데이트
  submitActionLabel: string
  onSubmit: () => void

}
export const PostForm: React.FC<PostFormProps> = ({
  open,
  isNewPost,
  onChangeOpen,
  formTitle,
  userIdValue,
  titleValue,
  contentValue,
  onChangeTitle,
  onChangeContent,
  onChangeUserId,
  submitActionLabel,
  onSubmit,

}) => {

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={titleValue}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={contentValue}
            onChange={(e) => onChangeContent(e.target.value)}
          />
          {isNewPost && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={userIdValue}
              onChange={(e) => onChangeUserId?.(Number(e.target.value))}
            />
          )}
          <Button onClick={onSubmit}>{submitActionLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}