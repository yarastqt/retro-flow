import { memo, useEffect } from 'react'

import { RouteContext } from './route-context'
import { useRouterState } from './router-context'
import { RenderMode } from './types'
import { useIsSSR } from './use-is-ssr'

export interface RouteRendererProps {
  index: number
}

export const RouteRenderer = memo<RouteRendererProps>((props) => {
  const { index } = props

  const isServerSideRender = useIsSSR()
  const state = useRouterState()

  const route = state?.matches.at(index)

  useEffect(() => {
    if (state.errors && state.errors.level === index) {
      throw state.errors.error
    }
  }, [state.errors, index])

  const renderMode = route?.renderMode ?? state.renderMode
  const shouldSkipRender = !route || (isServerSideRender && renderMode === RenderMode.CLIENT)

  if (shouldSkipRender) {
    return null
  }

  const RouteComponent = route.component

  return (
    <RouteContext.Provider value={index + 1}>
      <RouteComponent />
    </RouteContext.Provider>
  )
})
