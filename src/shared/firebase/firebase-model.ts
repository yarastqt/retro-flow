import { createEffect, createEvent, createStore, sample } from 'effector'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { initializeAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { spread } from 'patronum'

import { AppGateModel } from '@app/shared/app-gate'

const firebaseAttached = createEvent()

const $firebase = createStore<FirebaseApp | null>(null)
const $firestore = createStore<Firestore | null>(null)
const $fireauth = createStore<Auth | null>(null)

const createFireBaseFx = createEffect(() => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  const firebase = initializeApp(firebaseConfig)
  const firestore = getFirestore(firebase)
  const fireauth = initializeAuth(firebase)

  return {
    firebase,
    firestore,
    fireauth,
  }
})

sample({
  clock: AppGateModel.appBeforeStarted,
  target: createFireBaseFx,
})

sample({
  clock: createFireBaseFx.doneData,
  target: spread({
    firebase: $firebase,
    firestore: $firestore,
    fireauth: $fireauth,
  }),
})

sample({
  clock: createFireBaseFx.done,
  fn: () => {},
  target: firebaseAttached,
})

sample({
  clock: createFireBaseFx.failData,
  target: createEffect((reason: Error) => {
    console.error('>>> reason', reason)
  }),
})

export const FirebaseModel = {
  $firebase,
  $firestore,
  $fireauth,
  firebaseAttached,
}
