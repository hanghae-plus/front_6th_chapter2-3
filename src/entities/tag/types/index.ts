// PostsManagerPage.tsx에서 추론한 Tag 관련 타입 정의들
export interface Tag {
  url: string;
  slug: string;
}

export type TagsResponse = Tag[];
