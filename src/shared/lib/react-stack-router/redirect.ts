export interface RedirectOptions {
  status: number
}

export class RedirectException extends Error {
  constructor(
    public url: string,
    public options?: RedirectOptions,
  ) {
    super()
  }
}

export function redirect(url: string, options?: RedirectOptions) {
  throw new RedirectException(url, options)
}
