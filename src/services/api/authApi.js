// Real backend implementation of AuthApi (see ../contract.d.ts).
// To be written by the backend developer at integration time.
import { ApiError } from '../errors'

const notReady = () => {
  throw new ApiError('UNKNOWN', 'Real API not implemented yet. Set VITE_USE_MOCK=true.')
}

export const authApi = {
  getSession: async () => null,
  signIn: notReady,
  signOut: async () => {},
}
