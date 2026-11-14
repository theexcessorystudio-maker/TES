import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'c'

/** Link that opens the shop filtered to one category (used by the home page bento). */
export const categoryHref = (category) => `/?${PARAM}=${encodeURIComponent(category)}#shop`

/**
 * The selected shop category lives in the URL (?c=Rings), so filters are shareable and other
 * components can deep-link into them. Unknown values fall back to 'All'.
 */
export function useShopCategory(available) {
  const [params, setParams] = useSearchParams()
  const raw = params.get(PARAM)
  const category = raw && available.includes(raw) ? raw : 'All'
  const setCategory = useCallback((next) => setParams((p) => {
    if (next === 'All') p.delete(PARAM)
    else p.set(PARAM, next)
    return p
  }, { replace: true }), [setParams])
  return [category, setCategory]
}
