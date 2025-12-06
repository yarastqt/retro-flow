import type { Attributes, FC, ReactNode, PropsWithChildren as ReactPropsWithChildren } from 'react'

type ChildrenProp<T> = 'children' extends keyof T ? T['children'] : ReactNode

type RefProp<T> = 'ref' extends keyof T ? T['ref'] : unknown

export type PropsWithChildren<T> = 'children' extends keyof T ? T : ReactPropsWithChildren<T>

export interface SlotComponent<Props = object> extends FC<PropsWithChildren<Props> & Attributes> {
  /**
   * @internal
   */
  __slotName: string
}

export interface SlotItem<Props = object> {
  name: string
  props: PropsWithChildren<Props>
  /**
   * @deprecated Accessing element.ref was removed in React 19. Use `props.ref` instead.
   */
  ref?: RefProp<Props>
  rendered: ChildrenProp<Props>
}
