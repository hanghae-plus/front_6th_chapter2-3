import { Posts } from '../../../../entities/post/model/type';

export interface SearchPostTypes {
  posts: Posts[];
  total: number;
}
