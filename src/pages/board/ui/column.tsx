import type { FC, ReactNode } from 'react'

export interface ColumnProps {
  children: ReactNode
}

export const Column: FC<ColumnProps> = (props) => {
  const { children } = props

  return <div>{children}</div>
}
