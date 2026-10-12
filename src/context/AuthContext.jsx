import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/services'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    authApi.getSession().then((s) => {
      if (alive) {
        setUser(s)
        setLoading(false)
      }
    })
    const off = authApi.onChange?.((s) => setUser(s))
    return () => {
      alive = false
      off?.()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: async (email, password) => setUser(await authApi.signIn(email, password)),
      signOut: async () => {
        await authApi.signOut()
        setUser(null)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
