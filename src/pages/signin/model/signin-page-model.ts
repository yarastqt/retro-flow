import { attach, createEvent, sample } from 'effector'
import {
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import invariant from 'ts-invariant'

import { FirebaseModel } from '@app/shared/firebase'

const signinByAnonymousTriggered = createEvent<{ displayName: string }>()
const signinByGoogleTriggered = createEvent()

const signinAnonymousFx = attach({
  source: FirebaseModel.$fireauth,
  effect: async (fireauth, payload: { displayName: string }) => {
    try {
      invariant(fireauth)
      const result = await signInAnonymously(fireauth)
      updateProfile(result.user, { displayName: payload.displayName })
    } catch (error) {
      console.error('>>> error', error)
      throw error
    }
  },
})

const signinGoogleFx = attach({
  source: FirebaseModel.$fireauth,
  effect: async (fireauth) => {
    try {
      invariant(fireauth)
      const provider = new GoogleAuthProvider()
      await signInWithPopup(fireauth, provider)
    } catch (error) {
      console.error('>>> error', error)
      throw error
    }
  },
})

sample({
  clock: signinByAnonymousTriggered,
  target: signinAnonymousFx,
})

sample({
  clock: signinByGoogleTriggered,
  target: signinGoogleFx,
})

export const SigninPageModel = {
  signinByAnonymousTriggered,
  signinByGoogleTriggered,
}
