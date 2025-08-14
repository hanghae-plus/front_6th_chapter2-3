import { useMutation } from "@tanstack/react-query"
import { useSelectedPostStore } from "./store"
import { DeletePost, NewPost, Post } from "../type"
import { requestApi } from "../../../shared/lib"
import { Post as OriginPost } from "../../../entities"

export const useAddPostMutation = () => {
  const { posts, setPosts, setShowAddDialog } = useSelectedPostStore()

  return useMutation({
    mutationFn: async (newPost: NewPost) => {
      const { result, data } = await requestApi<OriginPost>(`/api/posts/add`, {
        method: "POST",
        body: newPost,
      })

      if (!result || !data) {
        throw new Error("게시물 추가에 실패했습니다")
      }

      return data
    },
    onMutate: async (newPost) => {
      // 낙관적 업데이트: 즉시 UI에 새 게시물 추가
      const optimisticPost: Post = {
        id: Date.now(), // 임시 ID
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId,
        reactions: { likes: 0, dislikes: 0 },
        tags: [],
        views: 0,
        author: {
          id: newPost.userId,
          username: "You", // 현재 사용자
          image: "/default-avatar.png", // 기본 아바타
        },
      }

      const previousPosts = posts

      // 새 게시물을 맨 앞에 추가
      setPosts([optimisticPost, ...posts])

      // 롤백용 데이터 반환
      return { previousPosts, optimisticPost }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context && context.previousPosts) {
        setPosts(context.previousPosts)
      }
      console.error("게시물 추가 오류:", error)
    },
    onSuccess: (data, variables, context) => {
      // 서버 응답으로 최종 업데이트 (임시 게시물을 실제 데이터로 교체)
      const realPost: Post = {
        ...data,
        reactions: { likes: 0, dislikes: 0 },
        tags: [],
        views: 0,
        author: {
          id: data.userId,
          username: "You",
          image: "/default-avatar.png",
        },
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === context?.optimisticPost.id // 임시 ID 찾아서
            ? realPost // 실제 서버 데이터로 교체
            : post,
        ),
      )

      // 성공 시 다이얼로그 닫기
      setShowAddDialog(false)
    },
  })
}

export const useUpdatePostMutation = () => {
    const { posts, setPosts, setShowEditDialog, selectedPost, setSelectedPost } = useSelectedPostStore()
  
    return useMutation({
      mutationFn: async (updatedPost: Post) => {
        const { result, data } = await requestApi<OriginPost>(`/api/posts/${updatedPost.id}`, {
          method: "PUT",
          body: {
            title: updatedPost.title,
            body: updatedPost.body,
            userId: updatedPost.userId,
          },
        })
  
        if (!result || !data) {
          throw new Error("게시물 수정에 실패했습니다")
        }
  
        return data
      },
      onMutate: async (updatedPost) => {
        // 이전 상태 저장 (롤백용)
        const previousPosts = posts
        const previousSelectedPost = selectedPost
  
        // 낙관적 업데이트: 즉시 UI에 수정된 게시물 반영
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id
              ? {
                  ...post,
                  title: updatedPost.title,
                  body: updatedPost.body,
                  // 다른 필드들은 기존 값 유지
                }
              : post
          )
        )
  
        // 롤백용 데이터 반환
        return { previousPosts, previousSelectedPost, updatedPostId: updatedPost.id }
      },
      onError: (error, variables, context) => {
        // 에러 시 이전 상태로 롤백
        if (context) {
          setPosts(context.previousPosts)
          setSelectedPost(context.previousSelectedPost)
        }
        console.error("게시물 수정 오류:", error)
      },
      onSuccess: (data, variables) => {
        // 서버 응답으로 최종 업데이트 (전체 게시물 데이터로 교체)
        const updatedPostWithAuthor: Post = {
          ...data,
          reactions: variables.reactions || { likes: 0, dislikes: 0 },
          tags: variables.tags || [],
          views: variables.views || 0,
          author: variables.author, // 기존 author 정보 유지
        }
  
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === data.id ? updatedPostWithAuthor : post
          )
        )
  
        // 성공 시 다이얼로그 닫기
        setShowEditDialog(false)
      },
    })
  }

  export const useDeletePostMutation = () => {
    const { posts, setPosts } = useSelectedPostStore()
  
    return useMutation({
      mutationFn: async (postId: number) => {
        const { result, data } = await requestApi<DeletePost>(`/api/posts/${postId}`, {
          method: "DELETE",
        })
  
        if (!result) {
          throw new Error("게시물 삭제에 실패했습니다")
        }
  
        return { deletedId: postId, data }
      },
      onMutate: async (postId) => {
        // 삭제될 게시물과 이전 상태 저장 (롤백용)
        const previousPosts = posts
        const deletedPost = posts.find(post => post.id === postId)
  
        // 낙관적 업데이트: 즉시 UI에서 게시물 제거
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
  
        // 롤백용 데이터 반환
        return { previousPosts, deletedPost, postId }
      },
      onError: (error, variables, context) => {
        // 에러 시 이전 상태로 롤백 (삭제된 게시물 복원)
        if (context && context.previousPosts) {
          setPosts(context.previousPosts)
        }
        console.error("게시물 삭제 오류:", error)
      },
      onSuccess: (result) => {
        // 삭제 성공 시 추가 처리가 필요하면 여기서
        // 이미 onMutate에서 UI 업데이트했으므로 별도 처리 불필요
        console.log(`게시물 ${result.deletedId} 삭제 완료`)
      },
    })
  }