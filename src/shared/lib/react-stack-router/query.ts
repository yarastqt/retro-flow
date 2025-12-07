import type { QueryParams, QueryPayload } from './types'

export function parseQueryParams(value: string) {
  const searchParams = new URLSearchParams(value)
  const params: QueryParams = Object.create(null)

  for (const [key, value] of searchParams) {
    const previousValue = params[key]

    if (previousValue === undefined) {
      params[key] = value
    } else {
      params[key] = Array.isArray(previousValue)
        ? [...previousValue, value]
        : [previousValue, value]
    }
  }

  return params
}

export function stringifyQueryParams(params: QueryPayload) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        searchParams.append(key, String(val))
      }
    } else {
      searchParams.append(key, String(value))
    }
  }

  return searchParams.toString()
}
