import { startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { allSettled, fork } from 'effector'
import { Provider as EffectorProvider } from 'effector-react'

import '@app/application/global.css'

import { getRoutes } from '@app/application/config/routes'
import { AppGateModel } from '@app/shared/app-gate'
import { createHistoryRouter, RouterProvider } from '@app/shared/lib/react-stack-router'

import '@app/shared/firebase'
import '@app/shared/session'

async function boostrap() {
  const root = createRoot(document.getElementById('root')!)

  const scope = fork()

  const router = createHistoryRouter({ routes: getRoutes() })

  await router.allSettled()
  await allSettled(AppGateModel.appBeforeStarted, { scope })

  startTransition(() => {
    root.render(
      <EffectorProvider value={scope}>
        <RouterProvider router={router} />
      </EffectorProvider>,
    )
  })
}

boostrap()
