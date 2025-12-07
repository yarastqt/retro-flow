import type { FC } from 'react'
import { Button } from 'react-aria-components'
import { useUnit } from 'effector-react'

import { SigninPageModel } from './model/signin-page-model'

export const SigninPage: FC = () => {
  const { onSigninByGooglePress } = useUnit({
    onSigninByGooglePress: SigninPageModel.signinByGoogleTriggered,
  })

  return (
    <div>
      <Button onPress={onSigninByGooglePress}>Sign in via google</Button>
    </div>
  )
}
