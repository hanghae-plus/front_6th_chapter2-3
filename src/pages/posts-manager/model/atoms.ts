import { atom, WritableAtom } from 'jotai';
import { User } from '../../../entities/users/api';

// UI State Atoms
export const isUserInfoModalOpenAtom = atom(false);
export const userInfoAtom = atom<User | null>(null);

// Derived Write-Only Atoms for Actions
export const openUserInfoModalAtom = atom(null, (_get, set, user: User) => {
  set(userInfoAtom, user);
  set(isUserInfoModalOpenAtom, true);
});

// Type definition for our context value
export interface PostsManagerAtoms {
  isUserInfoModalOpenAtom: WritableAtom<boolean, [boolean], void>;
  userInfoAtom: WritableAtom<User | null, [User | null], void>;
  openUserInfoModalAtom: WritableAtom<null, [User], void>;
}
