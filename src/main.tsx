import { startTransition } from 'react'
import { createRoot } from 'react-dom/client'
import { allSettled, fork } from 'effector'
import { Provider as EffectorProvider } from 'effector-react'

import '@app/application/global.css'

import BoardPage from '@app/pages/board'
import { AppGateModel } from '@app/shared/app-gate'

import '@app/shared/firebase'
import '@app/shared/session'

async function boostrap() {
  const root = createRoot(document.getElementById('root')!)

  const scope = fork()

  await allSettled(AppGateModel.appBeforeStarted, { scope })

  startTransition(() => {
    root.render(
      <EffectorProvider value={scope}>
        <BoardPage />
      </EffectorProvider>,
    )
  })
}

boostrap()
