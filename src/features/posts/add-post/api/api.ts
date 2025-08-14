export const addPostAPI = async (newPost: { title: string; body: string; userId: number }) => {
  try {
    console.log('Adding post with data:', newPost);
    const response = await fetch('/api/posts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`게시글 추가 실패: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Success result:', result);
    return result;
  } catch (error) {
    console.error('게시물 추가 오류:', error);
    throw error;
  }
};
