import { createContext, use } from 'react'

export const RouteContext = createContext(0)

export function useRouteIndex() {
  const context = use(RouteContext)

  return context
}
