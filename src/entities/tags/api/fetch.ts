export const fetchTags = async () => {
  try {
    return await fetch('/api/posts/tags');
  } catch (error) {
    console.error('태그 가져오기 오류:', error);
  }
};
