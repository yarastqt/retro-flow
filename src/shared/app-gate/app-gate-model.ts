import { createEffect, createEvent, createStore, sample } from 'effector'
import { createGate } from 'effector-react'

const AppGate = createGate()

const $isAppMounted = createStore(false)

const appBeforeStartedFx = createEffect(() => {
  // NOTE: Возвращаем promise, чтобы вызов appStarted произошел на следующем тике.
  return Promise.resolve()
})

/**
 * Приложение начало инициализировать зависимости и подписки.
 */
const appBeforeStarted = createEvent()

/**
 * Приложение проинициализированно.
 */
const appStarted = createEvent()

/**
 * Приложение примонтировано на клиенте.
 */
const appMounted = createEvent()

sample({
  clock: appBeforeStarted,
  target: appBeforeStartedFx,
})

sample({
  clock: appBeforeStartedFx.done,
  target: appStarted,
})

sample({
  clock: AppGate.open,
  target: appMounted,
})

sample({
  clock: appMounted,
  fn: () => true,
  target: $isAppMounted,
})

export const AppGateModel = {
  AppGate,
  $isAppMounted,
  appBeforeStarted,
  appMounted,
  appStarted,
}
