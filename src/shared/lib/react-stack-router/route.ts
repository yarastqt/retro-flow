/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Route } from './types'

export function createRoutes<Context extends Record<string, any> = object>(
  routes: Route<Context>[],
) {
  return routes
}
