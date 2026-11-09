import { useEffect, useRef } from 'react'

let openDialogs = 0

/** Escape-to-close + body scroll lock, reference counted so stacked dialogs behave. */
export function useDialogBehaviour(onClose) {
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close.current?.() }
    openDialogs += 1
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      openDialogs -= 1
      if (openDialogs === 0) document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}
