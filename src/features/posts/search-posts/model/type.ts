import { Posts } from '../../../../entities/post/model/types';

export interface SearchPostTypes {
  posts: Posts[];
  total: number;
}
