import { memo, useEffect, useLayoutEffect, type ReactNode } from 'react'

import { useRouter, useRouterState } from './router-context'

export interface RouterStateProviderProps {
  children?: ReactNode
}

export const RouterStateProvider = memo<RouterStateProviderProps>((props) => {
  const { children } = props

  const router = useRouter()
  const state = useRouterState()

  useEffect(() => {
    if (state?.redirect) {
      router.navigate(state.redirect, { replace: true })
    }
  }, [router, state?.redirect])

  useLayoutEffect(() => {
    if (!state?.location) {
      return
    }

    if (state.location.hash !== '') {
      const id = decodeURIComponent(state.location.hash.slice(1))
      const element = document.getElementById(id)

      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })

        return
      }
    }

    if (state.preventScrollReset) {
      return
    }

    window.scrollTo(0, 0)
  }, [state?.location, state.preventScrollReset])

  return children
})
