import { atom } from 'jotai';

import type { Tag } from '../types';

export const postsAtom = atom([] as import('../types').Post[]);
export const totalAtom = atom<number>(0);
export const skipAtom = atom<number>(0);
export const limitAtom = atom<number>(10);
export const searchQueryAtom = atom<string>('');
export const sortByAtom = atom<string>('');
export const sortOrderAtom = atom<'asc' | 'desc'>('asc');
export const tagsAtom = atom<Tag[]>([]);
export const selectedTagAtom = atom<string>('');
export const loadingAtom = atom<boolean>(false);
