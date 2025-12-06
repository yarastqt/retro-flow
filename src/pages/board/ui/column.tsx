import type { FC, ReactNode } from 'react'
import { Button } from 'react-aria-components'
import { useUnit } from 'effector-react'

import { createSlot, useSlots } from '@app/shared/lib/react-slots'

import { BoardModel } from '../model/board-model'

import styles from './column.module.css'

export interface ColumnProps {
  children: ReactNode
}

const TitleSlot = createSlot()
const CardsSlot = createSlot()

const Column: FC<ColumnProps> = (props) => {
  const { onAddNewCardPress } = useUnit({
    onAddNewCardPress: BoardModel.addTriggered,
  })

  const slots = useSlots(props)

  const title = slots.get(TitleSlot)
  const cards = slots.get(CardsSlot)

  return (
    <div className={styles.root}>
      <div className={styles.title}>{title?.rendered}</div>
      <div className={styles.cards}>
        {cards?.rendered}
        <Button className={styles.add} onPress={onAddNewCardPress}>
          Add card
        </Button>
      </div>
    </div>
  )
}

const _Column = Object.assign(Column, {
  Title: TitleSlot,
  Cards: CardsSlot,
})

export { _Column as Column }
