/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from 'react'
import type { Location } from 'history'

import type { RouterEvent } from './events'

export type Params = Record<string, string | string[] | undefined>

export type QueryParams = Record<string, string | string[] | undefined>
export type QueryPayload = Record<
  string,
  string | number | boolean | string[] | number[] | boolean[] | null
>

export interface RouteHandlerPayload<Context extends Record<string, any> = object> {
  /**
   * Custom context provided for the current route.
   */
  context: Context

  /**
   * The current navigation location object.
   */
  location: Location

  /**
   * Route parameters extracted from the URL path.
   */
  params: Params

  /**
   * Query string parameters parsed from the URL.
   */
  query: QueryParams

  /**
   * AbortSignal instance associated with the current navigation.
   * Allows route handlers to cancel asynchronous operations if navigation is interrupted,
   * for example when the user navigates away or a new navigation occurs before the current one finishes.
   *
   * This can be used to abort fetch requests or other async effects tied to navigation lifecycle.
   */
  signal: AbortSignal
}

export interface Route<Context extends Record<string, any> = object> {
  /**
   * Path pattern for the route.
   */
  path?: string

  /**
   * React component to render for this route.
   */
  component: ComponentType

  /**
   * Optional context for the route, which can override router context.
   */
  context?: Partial<Context>

  /**
   * Nested child routes.
   */
  children?: Route<Context>[]

  /**
   * Optional lifecycle hook called before entering the route.
   *
   * @param payload The payload passed to the handler
   * @returns Can return a context object or a Promise thereof
   */
  onBeforeEnter?: (
    payload: RouteHandlerPayload<Context>,
  ) => Promise<Context | void> | Context | void

  /**
   * Specifies where this particular route should be rendered: on the server or on the client.
   *
   * - `RenderMode.SERVER`: The route and its components will be rendered fully on the server (SSR).
   * - `RenderMode.CLIENT`: The route and its components will be rendered on the client (CSR).
   *
   * This option allows fine-grained control over the rendering strategy for individual routes,
   * enabling hybrid applications where some routes are server-rendered and others are client-rendered.
   */
  renderMode?: RenderMode
}

export enum RouterStatusCode {
  /** Route matched and loaded successfully. */
  OK = 200,

  /** Redirect to another route is required. */
  REDIRECT = 302,

  /** No route matched. */
  NOT_FOUND = 404,

  /** Internal router error. */
  INTERNAL_ERROR = 500,
}

export enum RenderMode {
  CLIENT = 'client',
  SERVER = 'server',
}

export type NavigationStage = 'idle' | 'loading' | 'error'

export interface RouterState<Context extends Record<string, any> = object> {
  /**
   * Route identifier.
   */
  id: string

  /**
   * Context object for the current route.
   */
  context: Context

  /**
   * Error encountered during navigation, if any.
   */
  errors?: { level: number; error: Error }

  /**
   * Current location object from the history API.
   */
  location: Location

  /**
   * Stack of matched routes for the current navigation.
   */
  matches: Route<Context>[]

  /**
   * Route parameters extracted from the URL.
   */
  params: Params

  /**
   * Redirect URL, if a redirect is pending or has occurred.
   */
  redirect?: string

  /**
   * Route render mode.
   */
  renderMode?: RenderMode

  /**
   * Parsed query string parameters.
   */
  query: QueryParams

  /**
   * Represents the current stage of the navigation process.
   *
   * Can be one of:
   * - `'idle'` — No navigation is occurring; the router is at rest.
   * - `'loading'` — A navigation is in progress (e.g., resolving routes, waiting for data).
   * - `'error'` — An error occurred during navigation (e.g., route matching or data loading failed).
   *
   * This field is useful for showing loading indicators or error messages based on navigation state.
   */
  stage: NavigationStage

  /**
   * Router status code indicating route resolution result.
   */
  status: RouterStatusCode

  /**
   * In browser-based environments, prevent resetting scroll after this navigation.
   *
   * @default false
   */
  preventScrollReset: boolean
}

export type HydratedRouterState = Pick<RouterState, 'id' | 'renderMode'>

export interface NavigateUrlParams {
  /**
   * The URL path to navigate to.
   */
  pathname?: string

  /**
   * Key-value pairs representing query string parameters to append to the URL.
   */
  query?: QueryPayload

  /**
   * The URL fragment identifier (hash) to append.
   */
  hash?: string
}

export type NavigateUrl = NavigateUrlParams | string

export interface NavigateOptions {
  /**
   * Whether to replace the current history entry instead of pushing a new one.
   */
  replace?: boolean

  /**
   * In browser-based environments, prevent resetting scroll after this navigation.
   */
  preventScrollReset?: boolean
}

export interface UpdateListener<Context extends Record<string, any> = object> {
  /**
   * Called when the router state changes.
   */
  (state: RouterState<Context>): void
}

export interface RouterEventListener {
  /**
   * Called when the router event is fired.
   */
  (event: RouterEvent): void
}

export interface RouterEvents {
  /**
   * Subscribes to low-level router events.
   *
   * The listener is invoked on specific events in the router lifecycle
   * such as navigation start, finish, cancel, or error.
   *
   * @param listener Callback function to handle router events
   * @returns Unsubscribe function
   */
  subscribe: (listener: RouterEventListener) => () => void
}

export interface Router<Context extends Record<string, any> = object> {
  /**
   * Returns the current router state.
   */
  get state(): RouterState<Context>

  /**
   * Loads the router and resolves the current route asynchronously.
   *
   * @param hydratedState Optional hydrated router state, usually used for server-side rendering or state hydration
   */
  allSettled: (hydratedState?: HydratedRouterState) => Promise<void>

  /**
   * Extracts a serializable snapshot of the current router state.
   *
   * This method is commonly used in server-side rendering (SSR) scenarios
   * to capture the state of the router after `allSettled()` has resolved.
   * The returned state can then be serialized and sent to the client,
   * where it may be passed back into `allSettled(hydratedState)` to
   * hydrate and resume the navigation state without recomputing it.
   */
  extract: () => HydratedRouterState

  /**
   * Navigates to the given url.
   *
   * @param url The target url to navigate to
   * @param options Optional navigation options
   */
  navigate: (url: NavigateUrl, options?: NavigateOptions) => void

  /**
   * Subscribes to router updates.
   *
   * @param listener Callback function to handle on updates
   * @returns Unsubscribe function
   */
  subscribe: (listener: UpdateListener<Context>) => () => void

  /**
   * Provides access to router events.
   */
  events: RouterEvents
}
