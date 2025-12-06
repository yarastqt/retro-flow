import type { FC } from 'react'

import { Canvas } from './ui/canvas'
import { Card } from './ui/card'
import { Column } from './ui/column'
import { Header } from './ui/header'

export const BoardPage: FC = () => {
  return (
    <div>
      <Header />

      <Canvas>
        <Column>
          <Card />
        </Column>
      </Canvas>
    </div>
  )
}
