import { memo } from 'react'

import { RouteRenderer } from './route-renderer'

export const RouterOutlet = memo(() => {
  return <RouteRenderer index={0} />
})
