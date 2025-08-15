import {useApp} from "../hooks/useApp.tsx"
import {Button, CardHeader, CardTitle} from "../components"
import {Plus} from "lucide-react"

export function PostManagerHeader() {
  const {setShowPostAddDialog} = useApp()

  function handleAddPost() {
    setShowPostAddDialog(true)
  }

  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={handleAddPost}>
          <Plus className="w-4 h-4 mr-2"/>
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  )
}