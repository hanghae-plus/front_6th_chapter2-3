import React from 'react'
import { useTagsQuery, usePostsQuery } from '../entities/post/hooks'

const StatCard = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="p-4 bg-white rounded shadow text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

const DashboardPage: React.FC = () => {
  const { data: tags } = useTagsQuery()
  const { data: postsResp } = usePostsQuery()
  const total = postsResp?.total ?? 0
  const tagCount = tags?.length ?? 0
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">대시보드</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatCard label="총 게시물" value={total} />
        <StatCard label="등록 태그 수" value={tagCount} />
        <StatCard label="오늘 작성" value="-" />
      </div>
    </div>
  )
}
export default DashboardPage
