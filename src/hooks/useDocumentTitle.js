import { useEffect } from 'react'

const BRAND = 'The Excessory Studio'

/** Sets the browser tab title for a page and restores the previous title on unmount. */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${BRAND}` : BRAND
    return () => { document.title = previous }
  }, [title])
}
