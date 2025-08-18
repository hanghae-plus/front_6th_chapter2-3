export interface SearchParams {
  search?: string
  tag?: string
  sortBy?: string
  sortOrder?: string
}

export const buildSearchParams = (
  params: SearchParams,
  currentSearch: string
): string => {
  const urlParams = new URLSearchParams(currentSearch)
  
  if (params.search) {
    urlParams.set('search', params.search)
  } else {
    urlParams.delete('search')
  }
  
  if (params.tag && params.tag !== 'all') {
    urlParams.set('tag', params.tag)
  } else {
    urlParams.delete('tag')
  }
  
  if (params.sortBy && params.sortBy !== 'none') {
    urlParams.set('sortBy', params.sortBy)
  } else {
    urlParams.delete('sortBy')
  }
  
  if (params.sortOrder && params.sortOrder !== 'asc') {
    urlParams.set('sortOrder', params.sortOrder)
  } else {
    urlParams.delete('sortOrder')
  }
  
  return urlParams.toString()
}

export const parseSearchParams = (search: string): SearchParams => {
  const params = new URLSearchParams(search)
  return {
    search: params.get('search') || '',
    tag: params.get('tag') || '',
    sortBy: params.get('sortBy') || '',
    sortOrder: params.get('sortOrder') || 'asc'
  }
}