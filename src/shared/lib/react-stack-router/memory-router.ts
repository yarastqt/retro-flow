/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMemoryHistory } from 'history'

import { createRouter, type RouterOptions } from './router'

export interface MemoryRouterOptions<Context extends Record<string, any> = object> extends Pick<
  RouterOptions<Context>,
  'context' | 'routes' | 'renderMode'
> {
  /**
   * Initial URL to use for the router history.
   */
  initialUrl: string
}

export function createMemoryRouter<Context extends Record<string, any> = object>(
  options: MemoryRouterOptions<Context>,
) {
  const { context, initialUrl, renderMode, routes } = options

  const history = createMemoryHistory({ initialEntries: [initialUrl] })
  const router = createRouter({ context, history, renderMode, routes })

  return router
}
