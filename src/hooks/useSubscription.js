import { useEffect, useState } from 'react'

/**
 * Generic adapter from a Firestore-style `subscribe(onData, onError) => unsubscribe` function to React state.
 * Pass `null` as subscribe to stay idle (e.g. while waiting for a signed-in user).
 */
export function useSubscription(subscribe, deps, initial = []) {
  const [state, setState] = useState({ data: initial, loading: !!subscribe, error: null })
  useEffect(() => {
    if (!subscribe) { setState({ data: initial, loading: false, error: null }); return undefined }
    setState((s) => ({ ...s, loading: true }))
    return subscribe(
      (data) => setState({ data, loading: false, error: null }),
      (error) => setState((s) => ({ ...s, loading: false, error })),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
