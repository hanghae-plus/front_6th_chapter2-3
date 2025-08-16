import React, { createContext, useContext, useState, ReactNode } from 'react';

import { type PostType } from '../../entities';

interface ModalContextType {
  // 게시물 상세 모달 상태
  selectedPost: PostType | null;
  showPostDetailDialog: boolean;
  openPostDetail: (post: PostType) => void;
  closePostDetail: () => void;

  // 사용자 모달 상태
  selectedUserId: number | null;
  showUserModal: boolean;
  openUserModal: (userId: number) => void;
  closeUserModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  // 게시물 상세 모달 상태
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);

  // 사용자 모달 상태
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // 게시물 상세 모달 함수들
  const openPostDetail = (post: PostType) => {
    setSelectedPost(post);
    setShowPostDetailDialog(true);
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setShowPostDetailDialog(false);
  };

  // 사용자 모달 함수들
  const openUserModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setSelectedUserId(null);
    setShowUserModal(false);
  };

  const value: ModalContextType = {
    selectedPost,
    showPostDetailDialog,
    openPostDetail,
    closePostDetail,
    selectedUserId,
    showUserModal,
    openUserModal,
    closeUserModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
