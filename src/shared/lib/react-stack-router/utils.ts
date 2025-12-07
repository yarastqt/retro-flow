/* eslint-disable @typescript-eslint/no-explicit-any */
export function joinPaths(...paths: Array<string | undefined>) {
  return paths
    .filter((path) => path !== undefined)
    .join('/')
    .replace(/\/{2,}/g, '/')
}

export function normalizeException(err: unknown) {
  if (err instanceof Error) {
    return err
  }

  let message: string

  if (typeof err === 'string') {
    message = err
  } else {
    try {
      message = JSON.stringify(err)
    } catch {
      message = 'Unknown error occurred'
    }
  }

  const error = new Error(message)

  ;(error as any).originalError = err

  return error
}

export function isExternalUrl(url: string) {
  if (/^(https?:)?\/\//i.test(url)) {
    try {
      const { host } = new URL(url, window.location.origin)

      return host !== window.location.host
    } catch {
      return false
    }
  }

  return false
}
