import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { ToastViewport } from '../components/ui/Toast/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef()

  const dismiss = useCallback(() => setToast(null), [])
  /** notify('Saved') · notify('Failed', { tone: 'error' }) · notify('Added', { action: { label, onClick } }) */
  const notify = useCallback((message, { tone = 'info', action, duration = 2800 } = {}) => {
    clearTimeout(timer.current)
    setToast({ id: Date.now(), message, tone, action })
    timer.current = setTimeout(() => setToast(null), duration)
  }, [])

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toast={toast} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
