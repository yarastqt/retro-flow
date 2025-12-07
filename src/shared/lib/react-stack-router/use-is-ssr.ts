import { startTransition, useEffect, useState, useSyncExternalStore } from 'react'

interface SSRState {
  isSSR: boolean
  onStoreChange: null | (() => void)
}

function createSSRStore() {
  const state: SSRState = { isSSR: false, onStoreChange: null }

  function hydrated() {
    if (state.isSSR) {
      state.isSSR = false

      if (state.onStoreChange) {
        state.onStoreChange()
      }
    }
  }

  function subscribe(onStoreChange: () => void) {
    state.onStoreChange = onStoreChange

    return () => {
      state.onStoreChange = null
    }
  }

  function getSnapshot() {
    return state.isSSR
  }

  function getServerSnapshot() {
    state.isSSR = true

    return state.isSSR
  }

  return {
    hydrated,
    subscribe,
    getSnapshot,
    getServerSnapshot,
  }
}

export function useIsSSR() {
  const [store] = useState(() => createSSRStore())
  const isSSR = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)

  useEffect(() => {
    startTransition(() => store.hydrated())
  }, [store])

  return isSSR
}
