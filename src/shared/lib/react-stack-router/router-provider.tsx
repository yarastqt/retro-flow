/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, type ReactNode } from 'react'

import { RouterContext } from './router-context'
import { RouterOutlet } from './router-outlet'
import { RouterStateProvider } from './router-state-provider'
import type { Router } from './types'

export interface RouterProviderProps {
  /**
   * React node to render as children of the `RouterProvider`.
   *
   * However, to ensure the router renders its content properly, you must include the
   * `RouterOutlet` component somewhere in your component tree
   * inside these children. The RouterOutlet is responsible for rendering
   * the matched route’s component.
   *
   * @example
   *
   * <RouterProvider router={router}>
   *   <main>
   *     <RouterOutlet />
   *   </main>
   * </RouterProvider>
   */
  children?: ReactNode

  /**
   * Router instance used for application navigation and routing
   */
  router: Router<any>
}

export const RouterProvider = memo<RouterProviderProps>((props) => {
  const { children, router } = props

  return (
    <RouterContext value={router}>
      <RouterStateProvider>{children ?? <RouterOutlet />}</RouterStateProvider>
    </RouterContext>
  )
})
