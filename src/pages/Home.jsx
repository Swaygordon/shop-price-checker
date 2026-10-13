import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '@/components/ProductGrid'
import { useProducts } from '@/hooks/useProducts'

const haystack = (p) => `${p.name} ${p.size ?? ''} ${p.unit ?? ''}`.toLowerCase()

export default function Home() {
  const { products, status, error, reload } = useProducts()
  const [params, setParams] = useSearchParams()
  const rawQ = (params.get('q') ?? '').trim()
  const q = rawQ.toLowerCase()

  const results = useMemo(
    () => (q ? products.filter((p) => haystack(p).includes(q)) : products),
    [products, q]
  )

  function clearSearch() {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('q')
      return next
    })
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-4xl sm:text-5xl">{rawQ ? `Results for “${rawQ}”` : 'All items'}</h1>
        {status === 'ready' && (
          <span className="font-medium text-muted-foreground" aria-live="polite">
            {results.length} item{results.length !== 1 && 's'}
          </span>
        )}
      </div>
      <ProductGrid products={results} status={status} error={error} onRetry={reload} query={rawQ} onClear={clearSearch} />
    </>
  )
}
