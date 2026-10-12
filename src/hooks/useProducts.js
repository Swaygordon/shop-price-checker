import { useCallback, useEffect, useState } from 'react'
import { productsApi } from '@/services'

/** Loads the catalogue. status: 'loading' | 'error' | 'ready' */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    setError('')
    try {
      setProducts(await productsApi.list())
      setStatus('ready')
    } catch (e) {
      setError(e.message || 'Something went wrong.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { products, setProducts, status, error, reload: load }
}
