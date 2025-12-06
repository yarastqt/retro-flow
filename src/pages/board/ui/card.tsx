import type { FC } from 'react'
import { Button } from 'react-aria-components'

import { HeartOutline } from '@app/shared/icons'

export const Card: FC = () => {
  return (
    <div className="px-5 py-4 flex flex-col gap-4 bg-white rounded-4xl corner-squircle">
      <div>
        Отличная координация между командами, задачи закрывались быстро и без задержек, очень
        довольны результатом!
      </div>

      <div className="flex justify-between">
        <div>SwiftAnchor</div>
        <Button className="cursor-pointer">
          <HeartOutline />
        </Button>
      </div>
    </div>
  )
}
