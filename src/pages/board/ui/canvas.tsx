import type { FC, ReactNode } from 'react'

import styles from './canvas.module.css'

export interface CanvasProps {
  children: ReactNode
}

export const Canvas: FC<CanvasProps> = (props) => {
  const { children } = props

  return <div className={styles.root}>{children}</div>
}
