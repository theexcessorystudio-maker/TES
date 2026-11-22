import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'q'

/** Link that opens the shop filtered by a search term (used by the header search). */
export const shopSearchHref = (query) => {
  const q = query.trim()
  return q ? `/?${PARAM}=${encodeURIComponent(q)}#shop` : '/#shop'
}

/** The shop search term lives in the URL (?q=pearl), so the header search can deep-link into it. */
export function useShopSearch() {
  const [params, setParams] = useSearchParams()
  const query = params.get(PARAM) || ''
  const setQuery = useCallback((next) => setParams((p) => {
    if (next) p.set(PARAM, next)
    else p.delete(PARAM)
    return p
  }, { replace: true }), [setParams])
  return [query, setQuery]
}
