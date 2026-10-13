import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import DeleteDialog from '@/components/DeleteDialog'
import PriceEditor from '@/components/PriceEditor'
import ProductForm from '@/components/ProductForm'
import { ProductImage } from '@/components/ProductCard'
import ProductGrid from '@/components/ProductGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useProducts } from '@/hooks/useProducts'
import { formatPrice, formatSize } from '@/lib/format'
import { productsApi } from '@/services'

const sortByName = (a, b) => a.name.localeCompare(b.name)
const priceOrFloor = (p) => (p.price ?? -1)

const SORT_OPTIONS = {
  'name-asc': { label: 'Name: A to Z', compare: sortByName },
  'name-desc': { label: 'Name: Z to A', compare: (a, b) => sortByName(b, a) },
  'price-desc': {
    label: 'Price: High to low',
    compare: (a, b) => priceOrFloor(b) - priceOrFloor(a) || sortByName(a, b),
  },
  'price-asc': {
    label: 'Price: Low to high',
    compare: (a, b) => priceOrFloor(a) - priceOrFloor(b) || sortByName(a, b),
  },
}

export default function Admin() {
  const { products, setProducts, status, error, reload } = useProducts()
  const [sortKey, setSortKey] = useState('name-asc')

  const sortedProducts = useMemo(
    () => [...products].sort(SORT_OPTIONS[sortKey].compare),
    [products, sortKey]
  )

  const add = (row) => setProducts((ps) => [...ps, row].sort(sortByName))

  /** Optimistic price update with rollback. Rejects on failure so the editor can reset. */
  async function savePrice(product, price) {
    const prev = product.price
    setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...p, price } : p)))
    try {
      const row = await productsApi.updatePrice(product.id, price)
      setProducts((ps) => ps.map((p) => (p.id === row.id ? row : p)))
      toast.success(`${product.name} is now ${formatPrice(price)}`)
    } catch (e) {
      setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...p, price: prev } : p)))
      toast.error(e.message || 'Could not update price')
    }
  }

  async function remove(product) {
    try {
      await productsApi.remove(product.id)
      setProducts((ps) => ps.filter((p) => p.id !== product.id))
      toast.success(`Deleted “${product.name}”`)
    } catch (e) {
      toast.error(e.message || 'Could not delete item')
      throw e // keep the dialog open
    }
  }


  return (
    <div className="grid gap-6">
      <h1 className="text-4xl sm:text-5xl">Manage items</h1>

      <ProductForm onCreated={add} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Item List{status === 'ready' ? ` (${products.length})` : ''}</CardTitle>
          {status === 'ready' && products.length > 1 && (
  <div className="flex items-center gap-2 text-sm">
    <label htmlFor="item-sort" className="font-medium text-muted-foreground">
      Sort by
    </label>
    <Select value={sortKey} onValueChange={setSortKey}>
      <SelectTrigger id="item-sort" className="h-9 w-45">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
          <SelectItem key={key} value={key}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="grid gap-3" aria-busy="true" aria-label="Loading items">
              {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          )}

          {status === 'error' && (
            <ProductGrid products={[]} status="error" error={error} onRetry={reload} />
          )}

          {status === 'ready' && products.length === 0 && (
            <ProductGrid products={[]} status="ready" />
          )}

          {status === 'ready' && products.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16"><span className="sr-only">Image</span></TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>New price</TableHead>
                      <TableHead className="text-right"><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell><ProductImage src={p.image_url} name={p.name} className="size-12 rounded-xl" letterClass="text-2xl" /></TableCell>
                        <TableCell>
                          <div className="font-bold">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{formatSize(p.size, p.unit)}</div>
                        </TableCell>
                        <TableCell className="font-display text-xl tracking-wide">{formatPrice(p.price)}</TableCell>
                        <TableCell><PriceEditor key={`${p.id}-${p.price}`} product={p} onSave={(price) => savePrice(p, price)} /></TableCell>
                        <TableCell className="text-right"><DeleteDialog product={p} onConfirm={() => remove(p)} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile stacked rows */}
              <ul className="grid gap-4 md:hidden">
                {sortedProducts.map((p) => (
                  <li key={p.id} className="grid gap-3 rounded-xl border border-ink/10 p-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image_url} name={p.name} className="size-14 shrink-0 rounded-xl" letterClass="text-2xl" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold">{p.name}</div>
                        <div className="font-display text-xl tracking-wide">{formatPrice(p.price)}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PriceEditor key={`${p.id}-${p.price}`} product={p} onSave={(price) => savePrice(p, price)} />
                      <DeleteDialog product={p} onConfirm={() => remove(p)} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      
    </div>
  )
}