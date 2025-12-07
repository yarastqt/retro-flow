/* eslint-disable @typescript-eslint/no-explicit-any */
import type { History } from 'history'
import { RouteMatcherBuilder } from 'route-peek'

import { NOT_FOUND_PATH } from './constants'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  type RouterEvent,
} from './events'
import { parseQueryParams, stringifyQueryParams } from './query'
import { RedirectException } from './redirect'
import { AbortControllerException } from './signal'
import {
  RenderMode,
  RouterStatusCode,
  type HydratedRouterState,
  type NavigateOptions,
  type NavigateUrl,
  type Route,
  type Router,
  type RouterEventListener,
  type RouterState,
  type UpdateListener,
} from './types'
import { isExternalUrl, joinPaths, normalizeException } from './utils'

export interface RouterOptions<Context extends Record<string, any> = object> {
  /**
   * Optional initial context object passed to the routing process.
   */
  context?: Context

  /**
   * History object used for managing session history and navigation.
   */
  history: History

  /**
   * Determines where the entire router will be rendered: on the server or on the client.
   *
   * - `RenderMode.SERVER`: The router and its route components will be rendered fully on the server (SSR).
   * - `RenderMode.CLIENT`: The router and its route components will be rendered on the client (CSR).
   */
  renderMode?: RenderMode

  /**
   * Array of route configurations describing the available route tree.
   */
  routes: Route<Context>[]
}

export function createRouter<Context extends Record<string, any> = object>(
  options: RouterOptions<Context>,
): Router<Context> {
  const { context, history, renderMode = RenderMode.SERVER, routes } = options

  const stateCache = new Map<string, RouterState<Context>>()
  const loaderCache = new Map<string, Promise<RouterState<Context>>>()
  const updateListeners = new Set<UpdateListener<Context>>()
  const eventListeners = new Set<RouterEventListener>()
  const builder = new RouteMatcherBuilder<Route<Context>[]>()

  builder.setTrailing(true)

  let pendingPreventScrollReset = false
  let isAllSettled = false
  let abortController: AbortController | null = null

  const traverseRoutes = (routes: Route<Context>[], parents: Route<Context>[] = []) => {
    for (const route of routes) {
      const parent = parents.at(-1)
      const parentPath = parent?.path ?? '/'

      const path = decodeURIComponent(joinPaths(parentPath, route.path))

      if (route.path) {
        builder.add(path, [...parents, route])
      }

      if (route.children) {
        traverseRoutes(route.children, [...parents, route])
      }
    }
  }

  traverseRoutes(routes)

  const matcher = builder.build()

  const createState = (overrides?: Partial<RouterState<Context>>) => {
    const state = {
      id: 'initial',
      context: {},
      error: undefined,
      location: history.location,
      matches: [],
      params: {},
      query: {},
      redirect: undefined,
      renderMode,
      stage: 'idle',
      status: RouterStatusCode.OK,
      preventScrollReset: false,
      ...overrides,
    } as RouterState<Context>

    return state
  }

  const subscribeToRouterState = (listener: UpdateListener<Context>) => {
    updateListeners.add(listener)

    return () => {
      updateListeners.delete(listener)
    }
  }

  const emitRouterState = (state: RouterState<Context>) => {
    for (const listener of updateListeners) {
      listener(state)
    }
  }

  const subscribeToRouterEvent = (listener: RouterEventListener) => {
    eventListeners.add(listener)

    return () => {
      eventListeners.delete(listener)
    }
  }

  const emitRouterEvent = (event: RouterEvent) => {
    if (!isAllSettled) {
      return
    }

    for (const listener of eventListeners) {
      listener(event)
    }
  }

  const getState = () => {
    const routeKey = history.createHref(history.location)
    const state = stateCache.get(routeKey)

    if (!state) {
      throw new Error(
        'Router state is not available. Make sure to call router.allSettled() before accessing the router state',
      )
    }

    return state
  }

  const runLoaders = async <Context extends Record<string, any> = object>(
    state: RouterState<Context>,
    signal: AbortSignal,
  ) => {
    for (let level = 0; level < state.matches.length; level++) {
      const route = state.matches[level]

      state.context = { ...state.context, ...route.context }

      try {
        if (signal.aborted) {
          throw new AbortControllerException()
        }

        const result = await route.onBeforeEnter?.({
          context: state.context,
          location: state.location,
          params: state.params,
          query: state.query,
          signal,
        })

        if (signal.aborted) {
          throw new AbortControllerException()
        }

        state.context = { ...state.context, ...result }
      } catch (error) {
        if (error instanceof AbortControllerException) {
          throw error
        }

        if (error instanceof RedirectException) {
          state.redirect = error.url
          state.status = error.options?.status ?? RouterStatusCode.REDIRECT
        } else {
          state.errors = { level, error: normalizeException(error) }
          state.stage = 'error'
          state.status = RouterStatusCode.INTERNAL_ERROR
        }

        return
      }
    }
  }

  const startNavigation = async (hydratedState?: HydratedRouterState) => {
    const routeKey = history.createHref(history.location)

    if (stateCache.has(routeKey)) {
      loaderCache.clear()
      abortController?.abort()

      return
    }

    if (loaderCache.has(routeKey)) {
      return
    }

    // eslint-disable-next-line no-async-promise-executor
    const deferredState = new Promise<RouterState<Context>>(async (resolve, reject) => {
      abortController?.abort()
      abortController = new AbortController()

      const matched = matcher.match(history.location.pathname).at(0)

      if (!matched) {
        throw new Error('No matches for any routes, please check routes configuration')
      }

      const state = createState({
        id: routeKey,
        context,
        status: matched.route === NOT_FOUND_PATH ? RouterStatusCode.NOT_FOUND : RouterStatusCode.OK,
        params: matched.params,
        query: parseQueryParams(history.location.search),
        matches: matched.payload,
      })

      if (hydratedState?.id === routeKey) {
        state.renderMode = hydratedState.renderMode
      }

      try {
        await runLoaders(state, abortController.signal)
      } catch (error) {
        return reject(error)
      }

      state.preventScrollReset = pendingPreventScrollReset
      pendingPreventScrollReset = false

      resolve(state)
    })

    loaderCache.set(routeKey, deferredState)

    try {
      emitRouterEvent(new NavigationStart(routeKey))
      const state = await deferredState

      // NOTE: A simple caching mechanism has been implemented to avoid calling
      //       the entire chain of calculations when moving along the same path.
      //       For a better experience, it is worth adding an LRU cache.
      stateCache.clear()
      stateCache.set(routeKey, state)

      emitRouterState(state)

      if (state.errors) {
        emitRouterEvent(new NavigationError(routeKey, state.errors.error))
      } else {
        emitRouterEvent(new NavigationEnd(routeKey))
      }
    } catch (error) {
      if (error instanceof AbortControllerException) {
        emitRouterEvent(new NavigationCancel(routeKey))

        return
      }

      emitRouterEvent(new NavigationError(routeKey, error))

      throw error
    } finally {
      loaderCache.clear()
    }
  }

  const normalizeNavigationUrl = (url: NavigateUrl) => {
    if (typeof url === 'string') {
      return url
    }

    return history.createHref({
      pathname: url.pathname,
      search: url.query ? stringifyQueryParams(url.query) : undefined,
      hash: url.hash,
    })
  }

  const navigate = (url: NavigateUrl, options?: NavigateOptions) => {
    const path = normalizeNavigationUrl(url)

    pendingPreventScrollReset = options?.preventScrollReset === true

    if (isExternalUrl(path)) {
      window.location.href = path
    } else {
      const method = options?.replace ? 'replace' : 'push'

      history[method](path)
    }
  }

  const allSettled = async (hydratedState?: HydratedRouterState) => {
    await startNavigation(hydratedState)
    isAllSettled = true
  }

  const extract = () => {
    const state = getState()
    const dehydrated = {
      id: state.id,
      renderMode: state.renderMode,
    } satisfies HydratedRouterState

    return dehydrated
  }

  history.listen(() => {
    startNavigation()
  })

  return {
    get state() {
      return getState()
    },
    allSettled,
    extract,
    navigate,
    events: {
      subscribe: subscribeToRouterEvent,
    },
    subscribe: subscribeToRouterState,
  }
}
