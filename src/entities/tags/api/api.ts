//  태그 가져오기

export async function fetchTags() {
  const response = await fetch('/api/posts/tags');
  if (!response) throw new Error('태그 가져오기 오류');
  return response.json();
}
