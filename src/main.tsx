import { startTransition } from 'react'
import { createRoot } from 'react-dom/client'

import BoardPage from '@app/pages/board'

function boostrap() {
  const root = createRoot(document.getElementById('root')!)

  startTransition(() => {
    root.render(<BoardPage />)
  })
}

boostrap()
