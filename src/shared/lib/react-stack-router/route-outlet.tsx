import { memo } from 'react'

import { useRouteIndex } from './route-context'
import { RouteRenderer } from './route-renderer'

export const RouteOutlet = memo(() => {
  const index = useRouteIndex()

  return <RouteRenderer index={index} />
})
