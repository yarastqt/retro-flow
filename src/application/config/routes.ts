import { lazy } from 'react'

import { createRoutes } from '@app/shared/lib/react-stack-router'

export function getRoutes() {
  return createRoutes([
    {
      path: '/',
      component: lazy(() => import('@app/pages/main')),
    },
    {
      path: '/b/{boardId}',
      component: lazy(() => import('@app/pages/board')),
    },
    {
      path: '/signin',
      component: lazy(() => import('@app/pages/signin')),
    },
    {
      path: '/*+',
      component: lazy(() => import('@app/pages/not-found')),
    },
  ])
}
