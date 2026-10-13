import { ApiError } from '../errors'

/** Map a Supabase / PostgREST error to the shared ApiError shape (see ../contract.d.ts). */
export function toApiError(e) {
  if (e instanceof ApiError) return e

  const status = e?.status
  const code = String(e?.code ?? '')

  if (status === 401 || status === 403 || code === '42501') {
    return new ApiError('FORBIDDEN', 'You do not have permission to do that.')
  }
  if (
    status === 400 ||
    status === 422 ||
    code.startsWith('22') || // data exception
    code.startsWith('23') // integrity constraint
  ) {
    return new ApiError('VALIDATION', e?.message || 'The data was rejected.')
  }
  if (e instanceof TypeError || /failed to fetch|networkerror/i.test(e?.message ?? '')) {
    return new ApiError('NETWORK', 'Could not reach the server. Check your connection.')
  }
  return new ApiError('UNKNOWN', e?.message || 'Something went wrong.')
}
