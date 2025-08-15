import { useAtom } from "jotai"
import { postsAtom, tagsAtom, selectedPostAtom, newPostAtom } from "./store"

export const usePosts = () => {
  const [posts, setPosts] = useAtom(postsAtom)
  
  return {
    posts,
    setPosts,
  }
}

export const useTags = () => {
  const [tags, setTags] = useAtom(tagsAtom)
  
  return {
    tags,
    setTags,
  }
}

export const useSelectedPost = () => {
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom)
  
  return {
    selectedPost,
    setSelectedPost,
  }
}

export const useNewPost = () => {
  const [newPost, setNewPost] = useAtom(newPostAtom)
  
  return {
    newPost,
    setNewPost,
  }
}