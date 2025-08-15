import { atom, WritableAtom } from 'jotai';
import { PostDTO } from '../../../entities/posts/api';
import { User } from '../../../entities/users/api';

// UI State Atoms
export const isPostDetailModalOpenAtom = atom(false);
export const detailPostAtom = atom<PostDTO | null>(null);
export const isUserInfoModalOpenAtom = atom(false);
export const userInfoAtom = atom<User | null>(null);

// Derived Write-Only Atoms for Actions
export const openPostDetailModalAtom = atom(null, (_get, set, post: PostDTO) => {
  set(detailPostAtom, post);
  set(isPostDetailModalOpenAtom, true);
});

export const openUserInfoModalAtom = atom(null, (_get, set, user: User) => {
  set(userInfoAtom, user);
  set(isUserInfoModalOpenAtom, true);
});

// Type definition for our context value
export interface PostsManagerAtoms {
  isPostDetailModalOpenAtom: WritableAtom<boolean, [boolean], void>;
  detailPostAtom: WritableAtom<PostDTO | null, [PostDTO | null], void>;
  isUserInfoModalOpenAtom: WritableAtom<boolean, [boolean], void>;
  userInfoAtom: WritableAtom<User | null, [User | null], void>;
  openPostDetailModalAtom: WritableAtom<null, [PostDTO], void>;
  openUserInfoModalAtom: WritableAtom<null, [User], void>;
}
