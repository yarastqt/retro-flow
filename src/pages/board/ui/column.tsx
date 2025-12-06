import type { FC, ReactNode } from 'react'

import { createSlot, useSlots } from '@app/shared/lib/react-slots'

export interface ColumnProps {
  children: ReactNode
}

const TitleSlot = createSlot()
const CardsSlot = createSlot()

const Column: FC<ColumnProps> = (props) => {
  const slots = useSlots(props)

  const title = slots.get(TitleSlot)
  const cards = slots.get(CardsSlot)

  return (
    <div className="w-[336px]">
      <div>{title?.rendered}</div>
      <div>{cards?.rendered}</div>
    </div>
  )
}

const _Column = Object.assign(Column, {
  Title: TitleSlot,
  Cards: CardsSlot,
})

export { _Column as Column }
