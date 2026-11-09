import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/** The open product lives in the URL (?p=<id>) so every product view is shareable and back-button friendly. */
export function useProductViewer() {
  const [params, setParams] = useSearchParams()
  const productId = params.get('p')
  const open = useCallback((id) => setParams((p) => { p.set('p', id); return p }, { replace: !!productId }), [setParams, productId])
  const close = useCallback(() => setParams((p) => { p.delete('p'); return p }, { replace: true }), [setParams])
  return { productId, open, close }
}
