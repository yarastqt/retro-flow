/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBrowserHistory } from 'history'

import { createRouter, type RouterOptions } from './router'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HistoryRouterOptions<Context extends Record<string, any> = object> extends Pick<
  RouterOptions<Context>,
  'context' | 'routes'
> {}

export function createHistoryRouter<Context extends Record<string, any> = object>(
  options: HistoryRouterOptions<Context>,
) {
  const { context, routes } = options

  const history = createBrowserHistory()
  const router = createRouter({ context, history, routes })

  return router
}
