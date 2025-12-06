import {
  isValidElement,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
} from 'react'

import type { PropsWithChildren, SlotComponent } from './types'

export function isSlotElement<P = object>(
  node: ReactNode,
): node is ReactElement<PropsWithChildren<P>, SlotComponent<P>> {
  return isValidElement(node) && isSlotComponent(node.type)
}

export function isSlotComponent<T = object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: string | JSXElementConstructor<any>,
): type is SlotComponent<T> {
  return typeof type === 'function' && '__slotName' in type
}
