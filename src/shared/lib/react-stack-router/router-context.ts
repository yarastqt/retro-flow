/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, use, useSyncExternalStore } from 'react'

import type { Params, QueryParams, Router } from './types'

export const RouterContext = createContext<Router<any> | null>(null)

export function useRouter() {
  const context = use(RouterContext)

  if (!context) {
    throw new Error('RouterContext is not provided')
  }

  return context
}

export function useRouterState() {
  const router = useRouter()
  const state = useSyncExternalStore(
    router.subscribe,
    () => router.state,
    () => router.state,
  )

  return state
}

export function useLocation() {
  const { location } = useRouterState()

  return location
}

export function useParams<T extends Params>() {
  const { params } = useRouterState()

  return params as T
}

export function useQueryParams<T extends QueryParams>() {
  const { query: search } = useRouterState()

  return search as T
}

export function useRouterContext<T>() {
  const { context } = useRouterState()

  return context as T
}

export function useRouterError() {
  const { errors } = useRouterState()

  return errors?.error
}

export function useNavigationStage() {
  const { stage } = useRouterState()

  return stage
}

export function useNavigate() {
  const router = useRouter()

  return router.navigate
}
