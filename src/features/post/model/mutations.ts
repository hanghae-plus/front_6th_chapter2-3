// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { createPost, updatePost, deletePost } from "@/features/post/api"
// import { POST_QUERY_KEYS, type CreatePost, type UpdatePost } from "@/entities/post/model"

// /**
//  * 게시물 생성 뮤테이션 훅
//  * @returns 게시물 생성 뮤테이션 객체
//  */
// export const useCreatePost = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: CreatePost) => createPost(data),
//     onSuccess: (newPost) => {
//       // 게시물 목록 캐시 무효화
//       queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

//       // 새 게시물을 캐시에 추가
//       queryClient.setQueryData(POST_QUERY_KEYS.detail(newPost.id), newPost)
//     },
//     onError: (error) => {
//       console.error("게시물 생성 실패:", error)
//     },
//   })
// }

// /**
//  * 게시물 수정 뮤테이션 훅
//  * @returns 게시물 수정 뮤테이션 객체
//  */
// export const useUpdatePost = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePost(id, data),
//     onSuccess: (updatedPost) => {
//       // 게시물 목록 캐시 무효화
//       queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

//       // 수정된 게시물 캐시 업데이트
//       queryClient.setQueryData(POST_QUERY_KEYS.detail(updatedPost.id), updatedPost)
//     },
//     onError: (error) => {
//       console.error("게시물 수정 실패:", error)
//     },
//   })
// }

// /**
//  * 게시물 삭제 뮤테이션 훅
//  * @returns 게시물 삭제 뮤테이션 객체
//  */
// export const useDeletePost = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (id: number) => deletePost(id),
//     onSuccess: (_, deletedId) => {
//       console.log("삭제 성공, deletedId:", deletedId)
//       console.log("POST_QUERY_KEYS.lists():", POST_QUERY_KEYS.lists())

//       // 캐시 무효화 제거 (자동 재요청 방지)
//       // queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

//       // 모든 관련 쿼리 키에 대해 직접 캐시 업데이트
//       const allQueryKeys = [POST_QUERY_KEYS.lists(), POST_QUERY_KEYS.all]

//       allQueryKeys.forEach((queryKey) => {
//         queryClient.setQueriesData({ queryKey }, (oldData: unknown) => {
//           console.log("setQueriesData 콜백 호출됨, queryKey:", queryKey)
//           console.log("oldData:", oldData)
//           if (!oldData) return oldData

//           // PostPaginatedResponse 형태인 경우
//           if (oldData && typeof oldData === "object" && "posts" in oldData) {
//             const data = oldData as { posts: Array<{ id: number }>; total?: number }
//             if (Array.isArray(data.posts)) {
//               console.log("PostPaginatedResponse 형태 처리")
//               const filteredPosts = data.posts.filter((post) => post.id !== deletedId)
//               console.log("필터링 후 게시물 수:", filteredPosts.length)
//               return {
//                 ...oldData,
//                 posts: filteredPosts,
//                 total: data.total ? data.total - 1 : 0, // total도 감소
//               }
//             }
//           }

//           // Post[] 형태인 경우
//           if (Array.isArray(oldData)) {
//             console.log("Post[] 형태 처리")
//             const filteredPosts = oldData.filter((post: { id: number }) => post.id !== deletedId)
//             console.log("필터링 후 게시물 수:", filteredPosts.length)
//             return filteredPosts
//           }

//           console.log("처리되지 않은 데이터 형태")
//           return oldData
//         })
//       })

//       // 상세 게시물 캐시도 제거
//       queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.detail(deletedId) })
//     },
//     onError: (error) => {
//       console.error("게시물 삭제 실패:", error)
//     },
//   })
// }
