import type { FC } from 'react'

import { Canvas } from './ui/canvas'
import { Card } from './ui/card'
import { Column } from './ui/column'
import { Header } from './ui/header'

import styles from './board-page.module.css'

export const BoardPage: FC = () => {
  return (
    <div className={styles.root}>
      <Header />

      <Canvas>
        <Column>
          <Column.Title>What went well</Column.Title>
          <Column.Cards>
            <Card />
            <Card />
            <Card />
          </Column.Cards>
        </Column>
      </Canvas>
    </div>
  )
}
