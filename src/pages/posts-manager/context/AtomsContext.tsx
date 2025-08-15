import { createContext, useContext } from 'react';
import { PostsManagerAtoms } from '../model/atoms';

// Create a context to hold the atoms
export const AtomsContext = createContext<PostsManagerAtoms | null>(null);

// Custom hook to use the atoms context
export const usePostsManagerAtoms = () => {
  const context = useContext(AtomsContext);
  if (!context) {
    throw new Error('usePostsManagerAtoms must be used within an AtomsContext.Provider');
  }
  return context;
};
