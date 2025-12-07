import { attach, createEvent, createStore, sample } from 'effector'
import { onAuthStateChanged } from 'firebase/auth'
import invariant from 'ts-invariant'

import { FirebaseModel } from '@app/shared/firebase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userUpdated = createEvent<any>()

const $user = createStore(null)

const subscribeToAuthChangeFx = attach({
  source: FirebaseModel.$fireauth,
  effect: (fireauth) => {
    invariant(fireauth)
    onAuthStateChanged(fireauth, (_payload) => {
      console.log(_payload)
    })
  },
})

sample({
  clock: FirebaseModel.firebaseAttached,
  target: subscribeToAuthChangeFx,
})

sample({
  clock: userUpdated,
  target: $user,
})

export const SessionModel = {
  $user,
}
