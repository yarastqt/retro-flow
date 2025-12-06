import type { FC } from 'react'
import { Button } from 'react-aria-components'

import { HeartOutline } from '@app/shared/icons'

import styles from './card.module.css'

export const Card: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.text}>
        Отличная координация между командами, задачи закрывались быстро и без задержек, очень
        довольны результатом!
      </div>

      <div className={styles.footer}>
        <div className={styles.author}>SwiftAnchor</div>
        <Button>
          <span />
          <HeartOutline />
        </Button>
      </div>
    </div>
  )
}
