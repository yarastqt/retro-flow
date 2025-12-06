import type { SlotComponent } from './types'

export function createSlot<Props = object>(name = 'unknown') {
  const Slot: SlotComponent<Props> = () => null

  Slot.displayName = `Slot(${name})`
  Slot.__slotName = name

  return Slot
}
