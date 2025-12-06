import { startTransition } from 'react'
import { createRoot } from 'react-dom/client'

function boostrap() {
  const root = createRoot(document.getElementById('root')!)

  startTransition(() => {
    root.render(<div>hello world</div>)
  })
}

boostrap()
