import type { FC } from 'react'

import { Canvas } from './ui/canvas'
import { Card } from './ui/card'
import { Column } from './ui/column'
import { Header } from './ui/header'

export const BoardPage: FC = () => {
  return (
    <div className="p-3 flex flex-col gap-4 h-screen">
      <Header />

      <Canvas>
        <Column>
          <Card />
        </Column>
      </Canvas>
    </div>
  )
}
