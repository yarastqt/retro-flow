import type { FC, ReactNode } from 'react'

export interface CanvasProps {
  children: ReactNode
}

export const Canvas: FC<CanvasProps> = (props) => {
  const { children } = props

  return <div>{children}</div>
}
