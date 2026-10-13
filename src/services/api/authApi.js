// AuthApi implementation (see ../contract.d.ts) backed by Supabase Auth.
import { ApiError } from '../errors'
import { supabase } from '../supabase/client'
import { toApiError } from '../supabase/mapError'

const toSession = (user) => (user?.email ? { email: user.email } : null)

export const authApi = {
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return toSession(data.session?.user)
    } catch {
      return null
    }
  },

  /** Throws ApiError('INVALID_CREDENTIALS') on a bad login. */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.status === 400 || error.status === 401 || error.status === 403) {
          throw new ApiError('INVALID_CREDENTIALS', 'Incorrect email or password.')
        }
        throw error
      }
      return toSession(data.user)
    } catch (e) {
      throw e instanceof ApiError ? e : toApiError(e)
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (e) {
      throw toApiError(e)
    }
  },

  /** Returns an unsubscribe function. */
  onChange(cb) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      cb(toSession(session?.user))
    })
    return () => data.subscription.unsubscribe()
  },
}
