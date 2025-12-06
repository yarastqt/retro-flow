import type { FC, ReactNode } from 'react'

export interface CanvasProps {
  children: ReactNode
}

export const Canvas: FC<CanvasProps> = (props) => {
  const { children } = props

  return (
    <div className="p-6 box-border rounded-2xl border border-neutral-100 bg-neutral-50 grow">
      {children}
    </div>
  )
}
